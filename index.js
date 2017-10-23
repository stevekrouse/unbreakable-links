const repoPathFromScriptAttribute = () => {
  const currentScript = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).find(s => s.src.includes('unbreakable-links'))
  return currentScript.getAttribute('repoPath')
}

const commitHashInURL = window.location.hash.slice(1)
const filePath = window.location.pathname
const repoPath = repoPathFromScriptAttribute() // TODO throw error if undefined


const load = (filePath, commitHash) => {
  const iframe = document.createElement("iframe")
  iframe.src = "https://cdn.rawgit.com/" + repoPath + "/" + commitHash + "/" + filePath
  iframe.height = "100%"
  iframe.width = "100%"
  // TODO make iframe styles go away
  document.body.appendChild(iframe)
}

const putCommitHashInURL = commitHash => {
  window.location.hash = commitHash
}

const getMostRecentCommitHash = () => fetch(
  'https://exec.clay.run/steve/github-project-data', {
    method: "POST",
    body: JSON.stringify({
      repo: repoPath,
    })
  })
  .then(response => response.json())
  .then(json => json[0].sha)

window.addEventListener("load", () => {
  if (commitHashInURL) {
    load(filePath, commitHashInURL)
  } else {
    getMostRecentCommitHash().then(putCommitHashInURL)
  }
})