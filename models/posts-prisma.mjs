import { AbstractPostsStore } from "./Posts.mjs";
import { default as DBG } from "debug";
import { prisma } from "./prisma.mjs";
import { toRelativeTime } from "./timeage.js";

const debug = DBG("posts:posts-prisma");
const dbgError = DBG("posts:error-prisma");

export async function connectDB() {
  await prisma.$connect();
}
export default class PrismaPostsStore extends AbstractPostsStore {
  async close() {
    await prisma.$disconnect();
  }
  async create(key, title, body, autherId) {
    await connectDB();
    const post = await prisma.posts.create({
      data: {
        key: key,
        title: title,
        body: body,
        autherId: autherId,
      },
      include: { auther: true },
    });

    this.emitCreated(post);
    return post;
  }

  async update(key, title, body, autherId) {
    await connectDB();
    const post = await prisma.posts.findUnique({ where: { key } });
    if (!post) {
      throw new Error("No post found for " + key);
    } else {
      await prisma.posts.update({
        where: { key },
        data: { key, title, body, autherId },
      });
      const post = await this.read(key);
      this.emitUpdated(post);
      return post;
    }
  }

  async read(key) {
    await connectDB();
    debug("post read key: ",key)
    let post = await prisma.posts.findUnique({
      where: { key },
      include: {
        auther: { omit: { photo: true } },
        comments: { include: { auther: { omit: { photo: true } } }, orderBy: {createdAt: "desc"} },
      },
    });
    try {
      if (post.comments) {
        post.commentsLength = post.comments.length;
      } 
    } catch {}

    if (!post) {
      return undefined;
    } else {
      return post;
    }
  }

  async destroy(key) {
    await connectDB();
    const deletepost = await prisma.posts.delete({ where: { key: key } });

    this.emitDestroyed(key);
  }

  async keylist() {
    await connectDB();
    debug("post key list read")
    const posts = await prisma.posts.findMany({
      orderBy: { updatedAt: "desc" },
    });
    const keys = posts.map((post) => post.key);
    return keys;
  }
  async getAllbyautherId(autherId) {
    await connectDB();
    const posts = await prisma.posts.findMany({
      where: { autherId: autherId },
      orderBy: { updatedAt: "desc" },
    });
    return posts.map((post) => {
      return post;
    });
  }
  async count() {
    await connectDB();
    return await prisma.posts.count();
  }
}
