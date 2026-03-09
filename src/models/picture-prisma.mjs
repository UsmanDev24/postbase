import { prisma } from "./prisma.js";
import {randomInt} from "node:crypto"

export class PrismaPictureStore {
  async add (blob, baseURL, type) {
    const id = randomInt(100000, 99999999)+ `.${type}`;
    const pic = await prisma.picture.create({
      data: {
        id : id,
        blob, 
        url: baseURL+id
      }
    })
    return pic
  }

  async remove(url) {
    await prisma.picture.delete({
      where: {url}
    })
  }

  async get(id) {
    const pic = await prisma.picture.findUnique({
      where: {id}
    })
    return pic
  }
}