import request from 'supertest'
import { APP } from '../index.js'
import {describe, it, expect} from '@jest/globals'



describe('API Endpoints', () => {
    describe('POST /modifyUser', () => {
        let GLOBALTOKEN = null
        it('should modify user details with valid data', async () => {
            const data_login = {
                email: "lu.saezd@duocuc.cl",
                password: "Erwin123*"
            }

            let response = await request(APP)
                .post("/api/v1/login")
                .send(data_login)
                .set("Accept", "application/json")
            
            GLOBALTOKEN = response.body.userToken.token

            const data = {
                firstName: 'NewFirstName',
                lastName: 'NewLastName',
                birthDate: '1991-02-02',
                address: 'New Address',
                phone: '0987654321',
                currentPassword: 'Erwin123*',
                password: 'Erwin123*',
                password2: 'Erwin123*'
            };

            response = await request(APP)
                .post("/api/v1/modifyUser")
                .set('Authorization', `Bearer ${GLOBALTOKEN}`)
                .send(data)
                .set('Accept', 'application/json');

            expect(response.status).toBe(202);
            expect(response.body.msg).toBe('User successfully modified');
        })
    
        it('should modify user details with invalid data', async () => {
            const data = {
                firstName: 'InvalidFirstName',
                lastName: 'InvalidLastName',
                birthDate: 'InvalidBirthDate',
                address: 'InvalidAddress',
                phone: 'InvalidPhone',
                currentPassword: 'InvalidCurrentPassword',
                password: 'InvalidNewPassword',
                password2: 'InvalidconfirmPassword!'
            };

            const response = await request(APP)
                .post("/api/v1/modifyUser")
                .set('Authorization', `Bearer ${GLOBALTOKEN}`)
                .send(data)
                .set('Accept', 'application/json');

            expect(response.status).toBe(400)
            expect(response.body.type).toBe('API_MODIFY_ERROR')
        })

        describe("XSS vulnerability describe", () => {
            let xssPayload = "<script>alert('XSS');</script>"

            it("must be protected when modifying user", async () => {
                const data = {
                    firstName: xssPayload,
                    lastName: xssPayload,
                    birthDate: xssPayload,
                    address: xssPayload,
                    phone: xssPayload,
                    currentPassword: xssPayload,
                    password: xssPayload,
                    password2: xssPayload
                }

                const response = await request(APP)
                    .post("/api/v1/modifyUser")
                    .set('Authorization', `Bearer ${GLOBALTOKEN}`)
                    .send(data)
                    .set("Accept", "application/json")

                expect(response.text).not.toContain(xssPayload)
            })
        })

        describe("SQL inyection vulnerability describe", () => {
            let maliciousQuery = "' OR '1'='1"

            it("Should not send information with a query", async () => {
                const data = {
                    firstName: maliciousQuery,
                    lastName: maliciousQuery,
                    birthDate: maliciousQuery,
                    address: maliciousQuery,
                    phone: maliciousQuery,
                    currentPassword: maliciousQuery,
                    password: maliciousQuery,
                    password2: maliciousQuery
                }
                const response = await request(APP)
                    .post("/api/v1/modifyUser")
                    .set('Authorization', `Bearer ${GLOBALTOKEN}`)
                    .send(data)
                    .set("Accept", "application/json")

                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty("msg")
            })
        })
    })
});