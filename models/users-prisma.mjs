
import { prisma } from "./prisma.mjs"


export class PrismaNotesUsersStore  {
  async create(userId, userName, displayName, firstName, email, provider, photo, photoType) {
    await prisma.$connect();
    const user = await prisma.notesUsers.create(
      {
        data: {
          id: userId,
          username: userName,
          displayName: displayName,
          firstName,
          email,
          provider: provider,
          photo: photo,
          photoType: photoType
        }
      }
    )
    return user
  }
  async update(userId, userName, displayName, firstName,email, provider, photo, photoType) {
    await prisma.$connect();
    const user = await prisma.notesUsers.update({
      where: {id: userId}, 
      data: {
        displayName,
        firstName,
        provider,
        email,
        photo,
        photoType
      },
    })
    return user
  }
  
  async read(userId ) {
    await prisma.$connect();
    const user = await prisma.notesUsers.findUnique({
      where: {id: userId},
      omit: {photo: true}
    })
    
    return user;
  }

  async updatePhoto(userId, photo, photoType) {
    await prisma.$connect()
    const user = await prisma.notesUsers.update({
      where: {id: userId},
      data: {photo, photoType},
      omit: {photo: true}
    })
    return user
  }
  async readByUserName(userName) {
    await prisma.$connect();
    const user = await prisma.notesUsers.findUnique({
      where: {username: userName}, 
      omit: {photo: true}
    })
    
    return user;
  }

  async  getPhotoByUserName(userName) {
    await prisma.$connect();
    const user = await prisma.notesUsers.findUnique({
      where: {username: userName}, 
    })
    return user;
  }
  async destroy(userId) {
    await prisma.$connect()
    await prisma.notesUsers.delete({
      where: {id: userId}
    })
  }
}