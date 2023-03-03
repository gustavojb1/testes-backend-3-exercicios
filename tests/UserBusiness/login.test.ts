import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("email", async () => {
        expect.assertions(1);
        const input: LoginInputDTO = {
            email: null,
            password: "bananinha"
        }

        try {
            await userBusiness.login(input);
        } catch(error){
            if (error instanceof BadRequestError){
                expect(error.message).toBe("'email' deve ser string");
            }
        }
    })

    test("password", async () => {
        expect.assertions(1);
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: null
        }

        try {
            await userBusiness.login(input);
        } catch(error){
            if (error instanceof BadRequestError){
                expect(error.message).toBe("'password' deve ser string");
            }
        }
    })

    test("email não cadastrado", async () => {
        expect.assertions(1);
        const input: LoginInputDTO = {
            email: "sdgdsgdsagsdg",
            password: "bananinha"
        }

        try {
            await userBusiness.login(input);
        } catch(error){
            if (error instanceof NotFoundError){
                expect(error.message).toBe("'email' não cadastrado");
            }
        }
    })

    test("password incorreto", async () => {
        expect.assertions(1);
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "senha"
        }

        try {
            await userBusiness.login(input);
        } catch(error){
            if (error instanceof BadRequestError){
                expect(error.message).toBe("'password' incorreto");
            }
        }
    })
})