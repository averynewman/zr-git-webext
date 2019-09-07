import { fs } from '../index'

async function deleteFolderRecursive (path) { // clears nonempty folders by recursion
  var files = []
  files = await fs.promises.readdir(path).catch((err) => {
    console.log(`deleteFolderRecursive: readdir failed with error ${err}`)
    throw err
  })
  files.forEach(async function (file, index) {
    var curPath = path + '/' + file
    var curPathStat = await fs.promises.lstat(curPath).catch((err) => {
      console.log(`deleteFolderRecursive: lstat on path ${curPath} failed with error ${err}`)
      throw err
    })
    if (curPathStat.isDirectory()) { // recurse
      console.log(`${curPath} is a directory, recursing`)
      deleteFolderRecursive(curPath)
    } else { // delete file
      await fs.promises.unlink(curPath).catch((err) => {
        console.log(`deleteFolderRecursive: unlink on path ${curPath} failed with error ${err}`)
        throw err
      })
    }
  })
  await fs.promises.rmdir(path).then((value) => {
    console.log(`deleteFolderRecursive: rmdir on path ${path} succeeded with value ${value}`)
    return value
  }, (err) => {
    console.log(`deleteFolderRecursive: rmdir on path ${path} failed with error ${err}`)
    throw err
  })
};

async function clearFilesystem () {
  console.log('clearFilesystem: starting directory read')
  fs.promises.readdir('/').then(
    async pathArray => {
      console.log(`clearFilesystem: starting directory clear with folders ${String(pathArray)}`)
      let promises = []
      for (let i = 0; i < pathArray.length; i++) {
        promises.push(deleteFolderRecursive(`/${pathArray[i]}`).then(
          success => {
            return success
          },
          error => {
            console.log(`clearFilesystem: error in single deleteFolderRecursive promise from array, clearing path ${pathArray[i]}`)
            console.log(error)
            throw error
          }
        ))
      }
      try {
        const success1 = await Promise.all(promises)
        console.log('clearFilesystem: compiled deleteFolderRecursive promises succeeded')
        return success1
      } catch (error1) {
        console.log(`clearFilesystem: compiled deleteFolderRecursive promises failed with error ${String(error1)}`)
        throw error1
      }
    },
    error => {
      console.log(`clearFilesystem: filesystem read failed with error ${String(error)}`)
      throw error
    }
  )
}

export { clearFilesystem }
