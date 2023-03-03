import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("delete", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    test("delete bem-sucedido", async () => {


        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-admin"
        }

        const response = await userBusiness.deleteUser(input)
        expect(response.message).toBe("Usuário deletado com sucesso")
    })

    test("token", async () => {
        expect.assertions(1);

        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: null
        }

        try {
            await userBusiness.deleteUser(input);
        } catch(error){
            if (error instanceof BadRequestError){
                expect(error.message).toBe("requer token");
            }
        }
    })

    test("payload", async () => {
        expect.assertions(1);

        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-qualquer"
        }

        try {
            await userBusiness.deleteUser(input);
        } catch(error){
            if (error instanceof BadRequestError){
                expect(error.message).toBe("token inválido");
            }
        }
    })

    test("payload", async () => {
        expect.assertions(1);

        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-normal"
        }

        try {
            await userBusiness.deleteUser(input);
        } catch(error){
            if (error instanceof BadRequestError){
                expect(error.message).toBe("somente admins podem deletar contas");
            }
        }
    })

    test("payload", async () => {
        expect.assertions(1);

        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-qualquer",
            token: "token-mock-admin"
        }

        try {
            await userBusiness.deleteUser(input);
        } catch(error){
            if (error instanceof NotFoundError){
                expect(error.message).toBe("'id' não existe");
            }
        }
    })

    

})