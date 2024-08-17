const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const packageJsonPath = 'package.json'

console.log('------process.env.TARGET_BRANCH--------')
const targetBranch = process.env.TARGET_BRANCH || 'development'

function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    return branch
  } catch (err) {
    console.error('Error getting current branch:', err)
    process.exit(1)
  }
}

const currentBranch = getCurrentBranch()
console.log(currentBranch)
const getVersionFromBranch = branch => {
  try {
    execSync(`git checkout ${branch} -- ${packageJsonPath}`)
    const data = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(data)
    return packageJson.version
  } catch (error) {
    console.error(`Error getting version from branch ${branch}:`, error)
    process.exit(1)
  }
}

const version1 = getVersionFromBranch(currentBranch)
const version2 = getVersionFromBranch(targetBranch)

console.log(`Version in branch ${currentBranch}: ${version1}`)
console.log(`Version in branch ${targetBranch}: ${version2}`)

if (version1 !== version2) {
  console.error(`Version mismatch: ${currentBranch} (${version1}) vs ${targetBranch} (${version2})`)
  process.exit(1)
} else {
  console.log(`Versions match: ${version1}`)
  process.exit(0)
}
