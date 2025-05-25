import { createKidsDTO } from "./dto/createKids.dto";
import * as KidRepo from './repository';

export const createKidService = async (data: createKidsDTO) => {
   return await KidRepo.createKid(data);
}