import request from 'supertest'
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

    describe('XSS vulnerability test', ()=>{
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

    describe("SQL inyection vulnerability describe", () => {
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

})





