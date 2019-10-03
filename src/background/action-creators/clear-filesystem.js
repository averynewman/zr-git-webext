import { fs } from '../index'

async function deleteFolderRecursive (path) { // clears nonempty folders by recursion
  console.log(`deleteFolderRecursive called on ${path}`)
  var contents = []
  contents = await fs.promises.readdir(path)
  console.log(`deleteFolderRecursive: contents of ${path} are ${contents}`)
  let handleIndividual = async function (file) {
    let curPath = path + '/' + file
    let curPathStat = await fs.promises.lstat(curPath)
    if (curPathStat.isDirectory()) { // recurse
      // console.log(`deleteFolderRecursive: ${curPath} is a directory, recursing`)
      await deleteFolderRecursive(curPath)
    } else { // delete file
      await fs.promises.unlink(curPath).then(() => {
        console.log(`deleteFolderRecursive: unlink on ${curPath} succeeded `)
      }, (err) => {
        console.log(`deleteFolderRecursive: unlink on ${curPath} failed with error ${err}`)
        throw err
      })
    }
  }
  let contentPromises = []
  for (let i = 0; i < contents.length; i++) {
    contentPromises.push(handleIndividual(contents[i]))
  }
  await Promise.all(contentPromises) // all contents deleted, can now delete folder
  await fs.promises.rmdir(path).then(() => {
    console.log(`deleteFolderRecursive: rmdir on ${path} succeeded`)
  }, async function (err) {
    console.log(`deleteFolderRecursive: rmdir on ${path} failed with error ${err}`)
    let contents = await fs.promises.readdir(path)
    console.log(`current contents of of ${path} are ${contents}`)
    throw err
  })
  console.log(`deleteFolderRecursive ending on ${path}`)
}

export async function clearFilesystem () {
  let path = '/'
  var contents = []
  contents = await fs.promises.readdir(path).catch((err) => {
    console.log(`clearFilesystem: readdir of ${path} failed with error ${err}`)
    throw err
  })
  console.log(`clearFilesystem: contents of ${path} are ${contents}`)
  contents.forEach(async function (file, index) {
    let curPath = path + file
    let curPathStat = await fs.promises.lstat(curPath)
    if (curPathStat.isDirectory()) { // call delFoldRec
      console.log(`clearFilesystem: ${curPath} is a directory, calling deleteFolderRecursive`)
      await deleteFolderRecursive(curPath)
    } else { // delete file
      await fs.promises.unlink(curPath).catch((err) => {
        console.log(`clearFilesystem: unlink on ${curPath} failed with error ${err}`)
        throw err
      })
    }
  })
  return true
}
