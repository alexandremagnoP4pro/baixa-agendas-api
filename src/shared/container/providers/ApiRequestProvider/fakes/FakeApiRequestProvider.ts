import AppError from "@shared/errors/AppError";
import axios from "axios";
import ICreateRequestDTO from "../dtos/ICreateRequestDTO";
import IApiRequestProvider from "../models/IApiRequestProvider";

export default class FakeApiRequestProvider implements IApiRequestProvider {
    public async post({ url, auth, body }: ICreateRequestDTO): Promise<any> {
        try {
            if (auth) {
                const { data } = await axios.post(url, body, { auth });
                return data;
            }
            const { data } = await axios.post(url, body);
            return data;
        } catch (error) {
            throw new AppError("Request were not successful", 503);
        }
    }

    put(data: ICreateRequestDTO): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(data: ICreateRequestDTO): Promise<any> {
        throw new Error("Method not implemented.");
    }

    public async get({ url, auth }: ICreateRequestDTO): Promise<any> {
        try {
            if (auth) {
                const { data } = await axios.get(url, { auth });
                return data;
            }
            const { data } = await axios.get(url);
            return data;
        } catch (error) {
            throw new AppError("Request were not successful", 503);
        }
    }
}
