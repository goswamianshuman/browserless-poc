export class RestaurantOwnerResponseDto {
    id: string;
    name: string;
    email: string;
}

export class RestaurantResponseDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner: RestaurantOwnerResponseDto;
}