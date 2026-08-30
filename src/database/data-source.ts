import {DataSource} from "typeorm";
import {validateEnv} from "../config/env";

const env = validateEnv(process.env);

export const AppDataSource = new DataSource({
    type: "postgres",
    url: env.DATABASE_URL,
    synchronize: false,
    migrations: [__dirname + "/migrations/*.{ts,js}"],
    migrationsRun: false,
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
});