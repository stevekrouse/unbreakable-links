const commitHashInURL = window.location.hash
const filePath = window.location.pathname

if (commitHashInURL) {
  load(filePath, commitHashInURL)
} else {
  getMostRecentCommitHash().then(putCommitHashInURL)
}


const load = (filePath, commitHash) => {
  // TODO
}

const putCommitHashInURL = commitHash => {
  window.location.hash = commitHash
}

const getMostRecentCommitHash = () => {
  // TODO 
}