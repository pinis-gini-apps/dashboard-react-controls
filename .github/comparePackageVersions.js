const fs = require('fs')
const { execSync } = require('child_process')

const targetBranch = process.argv[2]

function getCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch (err) {
    console.error('Error getting current branch:', err)
    process.exit(1)
  }
}

const currentBranch = getCurrentBranch()

const getVersionFromBranch = branch => {
  try {
    execSync(`git checkout ${branch} -- 'package.json'`)
    const packageJson = fs.readFileSync('package.json', 'utf8')
    const packageJsonParsed = JSON.parse(packageJson)
    return packageJsonParsed.version
  } catch (error) {
    console.error(`Error getting version from branch ${branch}:`, error)
    process.exit(1)
  }
}

const currentBranchVersion = getVersionFromBranch(currentBranch)
const targetBranchVersion = getVersionFromBranch(`remotes/origin/${targetBranch}`)

console.log(`Version in branch ${currentBranch}: ${currentBranchVersion}`)
console.log(`Version in branch ${targetBranch}: ${targetBranchVersion}`)

const isVersionGreater = (targetBranchVersion, currentBranchVersion) => {
  const parseVersion = version => version.split('.').map(Number)

  const [oldMajor, oldMinor, oldPatch] = parseVersion(targetBranchVersion)
  const [newMajor, newMinor, newPatch] = parseVersion(currentBranchVersion)

  if (newMajor > oldMajor) return true
  if (newMajor === oldMajor && newMinor > oldMinor) return true
  if (newMajor === oldMajor && newMinor === oldMinor && newPatch > oldPatch) return true

  return false
}

if (isVersionGreater(targetBranchVersion, currentBranchVersion)) {
  console.log(
    `\x1b[32mCurrent version (${currentBranchVersion}) is greater than the target version (${targetBranchVersion}).\x1b[0m`
  )
  process.exit(0)
} else {
  console.error(
    `\x1b[31mCurrent version (${currentBranchVersion}) is not greater than the target version (${targetBranchVersion}).\x1b[0m`
  )
  process.exit(1)
}
