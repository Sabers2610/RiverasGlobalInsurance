import request from 'supertest'
import {describe, it, expect} from '@jest/globals'
import { APP } from '../index.js'

describe('API Endpoints', () =>{
    
    let TOKEN = null
    let TOKENINVALID = null
    describe('POST /login', () => {
        it('should log in with valid credentials', async () => {
            const credentials = {
                email: 'juan@duocuc.cl',
                password: 'GlobalInsurance#2024'
            };

            const response = await request(APP)
                .post('/api/v1/login')
                .send(credentials)
                .set('Accept', 'application/json');

            expect(response.status).toBe(202);
            expect(response.body).toHaveProperty("userId")
            expect(response.body).toHaveProperty("userToken")
            TOKEN = response.body.userToken.token
        });

        it('should log in with valid credentials', async () => {
            const credentials = {
                email: 'er.nunez@duocuc.cl',
                password: 'GlobalInsurance#2024'
            };

            const response = await request(APP)
                .post('/api/v1/login')
                .send(credentials)
                .set('Accept', 'application/json');

            expect(response.status).toBe(202);
            expect(response.body).toHaveProperty("userId")
            expect(response.body).toHaveProperty("userToken")
            TOKENINVALID = response.body.userToken.token
        });
    });

    describe('POST /register', () =>{
        it('You must register users with valid data', async () =>{
            const data={
                firstName: "prueba", 
                lastName: "prueba", 
                birthDate: "1992/04/24", 
                address: "prueba", 
                phone: "9999999", 
                email: "prueba@gmail.com" 
            }

            const response = await request(APP)
                .post('/api/v1/register')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            expect(response.status).toBe(202)
            expect(response.body).toHaveProperty("msg")
        })

        it('You should not register users with invalid data', async () =>{
            const data={
                firstName: "", 
                lastName: "", 
                birthDate: "1992/04/24", 
                address: "", 
                phone: "", 
                email: "pruebagmailcom" 
            }

            const response = await request(APP)
                .post('/api/v1/register')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("msg")
        })

        it('You should not register users with valid data but an invalid token', async () =>{
            const data={
                firstName: "prueba2", 
                lastName: "prueba2", 
                birthDate: "1992/04/24", 
                address: "prueba", 
                phone: "9999999", 
                email: "prueba2@gmail.com" 
            }

            const response = await request(APP)
                .post('/api/v1/register')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKENINVALID}`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("message")
        })

        it('You should not register users with valid data but without a token', async () =>{
            const data={
                firstName: "prueba", 
                lastName: "prueba", 
                birthDate: "1992/04/24", 
                address: "prueba", 
                phone: "9999999", 
                email: "prueba@gmail.com" 
            }

            const response = await request(APP)
                .post('/api/v1/register')
                .send(data)
                .set('Accept', 'application/json')
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty("message")
        })
    })

    describe('XSS vulnerability test (Register)', ()=>{
        let xssPayload = "<script>alert('XSS');</script>"
        it("should be protected in register", async () => {
            const data={
                firstName: xssPayload, 
                lastName: xssPayload, 
                birthDate: "1992/04/24", 
                address: xssPayload, 
                phone: "9999999", 
                email: "prueba@gmail.com" 
            }

            const response = await request(APP)
                .post("/api/v1/register")
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            
            expect(response.text).not.toContain(xssPayload)
        })
    })

    describe("SQL inyection vulnerability describe (Register)", () => {
        let maliciousQuery = "' OR '1'='1"

        it("Should not send information with a query", async () => {

            const data={
                firstName: maliciousQuery, 
                lastName: maliciousQuery, 
                birthDate: "1992/04/24", 
                address: maliciousQuery, 
                phone: "9999999", 
                email: "prueba@gmail.com" 
            }

            const response = await request(APP)
                .post("/api/v1/register")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty("msg")
        })
    })

    describe('CSFR vulnerability test (Register)', ()=>{
        let CSFR = `<form action="http://victim-site.com/change_password" method="POST">
    <input type="hidden" name="password" value="newpassword">
    <input type="submit" value="Submit">
</form>
<script>
    document.forms[0].submit();
</script>`


        it("should be protected in register", async () => {
            const data={
                firstName: CSFR, 
                lastName: CSFR, 
                birthDate: "1992/04/24", 
                address: CSFR, 
                phone: "9999999", 
                email: "prueba@gmail.com"
            }

            const response = await request(APP)
                .post("/api/v1/register")
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            
            expect(response.text).not.toContain(CSFR)
        })
    })

    describe('GET /gelAll', () =>{

        it('Get all registered users', async () => {

            const response = await request(APP)
                .get('/api/v1/getAll')
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(200);
        });

        it('Get all registered users but token invalid', async () => {

            const response = await request(APP)
                .get('/api/v1/getAll')
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKENINVALID}`)

            expect(response.status).toBe(401);
        });

        it('Get users with filter (email)', async () =>{

            const data={
                email: "prueba@gmail.com" 
            }

            const response = await request(APP)
                .post('/api/v1/findEmail')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(200);
        })

        it('Get users with filter (firstName)', async () =>{

            const data={
                firstName: "prueba" 
            }

            const response = await request(APP)
                .post('/api/v1/findFirstName')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(200);
        })

        it('Get users with filter (lastName)', async () =>{

            const data={
                lastName: "prueba" 
            }

            const response = await request(APP)
                .post('/api/v1/findLastName')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(200);
        })

        it('search for a non-existing user (email)', async () =>{

            const data={
                email: "pruebamala@gmail.com" 
            }

            const response = await request(APP)
                .post('/api/v1/findEmail')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(404);
        })
    })

    describe('XSS vulnerability test (GetUsers)', ()=>{
        let xssPayload = "<script>alert('XSS');</script>"
        it("should be protected in register", async () => {
            const data={
                email: xssPayload 
            }

            const response = await request(APP)
                .post('/api/v1/findEmail')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            
            expect(response.text).not.toContain(xssPayload)
        })

        it("should be protected in register", async () => {
            const data={
                firstName: xssPayload 
            }

            const response = await request(APP)
                .post('/api/v1/findFirstName')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            
            expect(response.text).not.toContain(xssPayload)
        })

        it("should be protected in register", async () => {
            const data={
                lastName: xssPayload 
            }

            const response = await request(APP)
                .post('/api/v1/findLastName')
                .send(data)
                .set('Accept', 'application/json')
                .set("Authorization", `Bearer ${TOKEN}`)
            
            expect(response.text).not.toContain(xssPayload)
        })


    })

    describe("SQL inyection vulnerability describe (GetUsers)", () => {
        let maliciousQuery = "' OR '1'='1"

        it("Should not send information with a query", async () => {

            const data={
                email: maliciousQuery
            }

            const response = await request(APP)
                .post("/api/v1/findEmail")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty("msg")
        })

        it("Should not send information with a query", async () => {

            const data={
                firstName: maliciousQuery
            }

            const response = await request(APP)
                .post("/api/v1/findFirstName")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty("msg")
        })

        it("Should not send information with a query", async () => {

            const data={
                lastName: maliciousQuery
            }

            const response = await request(APP)
                .post("/api/v1/findLastName")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty("msg")
        })

    })

    describe('CSFR vulnerability test (GetUsers)', ()=>{
        let CSFR = `<form action="http://victim-site.com/change_password" method="POST">
                        <input type="hidden" name="password" value="newpassword">
                        <input type="submit" value="Submit">
                    </form>
                    <script>
                        document.forms[0].submit();
                    </script>`


        it("Should not send information with a query", async () => {

            const data={
                email: CSFR
            }

            const response = await request(APP)
                .post("/api/v1/findEmail")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.text).not.toContain(CSFR)
            expect(response.status).toBe(404)
        })

        it("Should not send information with a query", async () => {

            const data={
                firstName: CSFR
            }

            const response = await request(APP)
                .post("/api/v1/findFirstName")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.text).not.toContain(CSFR)
            expect(response.status).toBe(404)
        })

        it("Should not send information with a query", async () => {

            const data={
                lastName: CSFR
            }

            const response = await request(APP)
                .post("/api/v1/findLastName")
                .send(data)
                .set("Accept", "application/json")
                .set("Authorization", `Bearer ${TOKEN}`)

            expect(response.text).not.toContain(CSFR)
            expect(response.status).toBe(404)
        })
    })

})





