import { fs } from '../index'

export async function deleteFolderRecursive (path) { // clears nonempty folders by recursion
  console.log(`deleteFolderRecursive called on ${path}`)
  let contents = await fs.promises.readdir(path)
  console.log(`deleteFolderRecursive: contents of ${path} are ${contents}`)
  const handleIndividual = async function (item) {
    const curPath = path + item
    const curPathStat = await fs.promises.lstat(curPath)
    console.log(`handleIndividual called on ${curPath}`)
    if (curPathStat.isDirectory()) { // recurse
      // console.log(`deleteFolderRecursive: ${curPath} is a directory, recursing`)
      await deleteFolderRecursive(curPath + '/')
    } else { // delete file
      return fs.promises.unlink(curPath).then(async function () {
        console.log(`deleteFolderRecursive: unlink on ${curPath} succeeded `)
        const contentsTesting = await fs.promises.readdir(path)
        console.log(`AFTER UNLINKING deleteFolderRecursive: contents of ${path} are ${contentsTesting}`)
        return true
      }, (err) => {
        console.log(`deleteFolderRecursive: unlink on ${curPath} failed with error ${err}`)
        throw err
      })
    }
  }
  const contentLength = contents.length
  for (let i = 0; i < contentLength; i++) {
    await handleIndividual(contents[i])
  }
  console.log('for loop over')
  if (path === '/') {
    return true
  }
  return fs.promises.rmdir(path).then(() => {
    console.log(`deleteFolderRecursive: rmdir on ${path} succeeded`)
    return true
  }, async function (err) {
    console.log(`deleteFolderRecursive: rmdir on ${path} failed with error ${err}`)
    const contents = await fs.promises.readdir(path)
    console.log(`current contents of of ${path} are ${contents}`)
    throw err
  })
}
