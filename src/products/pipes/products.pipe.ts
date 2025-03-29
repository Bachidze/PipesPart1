import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from "@nestjs/common";

export class custompPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.price !== undefined) {
      const parsedPrice = parseFloat(value.price);
      if (isNaN(parsedPrice)) {
        throw new HttpException("price must be a number", HttpStatus.BAD_REQUEST);
      }
      value.price = parsedPrice;
    }
    return value;
  }
}
