import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @IsOptional()
    @IsString()
    public name: string;

    @IsNumber()
    @IsPositive()
    @Type(()=> Number)
    public price: number;
}
