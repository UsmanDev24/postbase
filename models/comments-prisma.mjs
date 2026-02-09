import EventEmitter from "events";

import { prisma } from "./prisma.mjs";

export class PrismaCommentsStore extends EventEmitter {
  async create(postkey, autherId, body) {
    await prisma.$connect()
    const comment = await prisma.comments.create({
      data : {
        postkey: postkey,
        autherId: autherId,
        body: body
      },
      include: {auther: {select: {username: true}}}
    })
    this.emit("commentcreated", postkey, comment)
    return comment
  }
  async read(id) {
    await prisma.$connect();
    const comment = await prisma.comments.findUnique({
      where: {id},
      include: { auther: {select: {username: true}}}
    })
    return comment
  }
  async destroy(id, postkey) {
    await prisma.$connect()
    await prisma.comments.delete({ where : {id}})
    this.emit("commentdestroyed",postkey, id)
  }
}