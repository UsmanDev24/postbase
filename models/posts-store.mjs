import { default as DBG } from 'debug';
const debug = DBG('posts:debug');
const error = DBG('posts:error');

let _postsStore ;
export async function useModel(model) {
  try {
    let postsStoreModule = await import(`./posts-${model}.mjs`);
    let postsStoreClass = postsStoreModule.default;
    _postsStore = new postsStoreClass();
    return _postsStore;
  } catch (error) {
    throw new Error(`No recognized postsStore in ${model} because ${error}`);
  }
}
export { _postsStore as postsStore}