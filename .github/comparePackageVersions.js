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

if (currentBranchVersion !== targetBranchVersion) {
  console.error(
    `Version mismatch: ${currentBranch} (${currentBranchVersion}) vs ${targetBranch} (${targetBranchVersion})`
  )
  process.exit(1)
} else {
  console.log(`Versions match: ${currentBranchVersion}`)
  process.exit(0)
}
