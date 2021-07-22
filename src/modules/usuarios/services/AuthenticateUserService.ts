/* eslint-disable prettier/prettier */
import { sign } from "jsonwebtoken";
import AppError from "@shared/errors/AppError";
import authConfig from "@config/auth";
import { inject, injectable } from "tsyringe";
import Usuario from "../infra/typeorm/entities/Usuario";
import IUsuariosRepository from "../repositories/IUsuariosRepository";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: Usuario;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject("UsuariosRepository")
        private usuariosRepository: IUsuariosRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) { }

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usuariosRepository.findByEmail(email);

        if (!user) {
            throw new AppError("Incorrect email/password combination", 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMatched) {
            throw new AppError("Incorrect email/password combination", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;


        const token = sign({}, secret as string, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
