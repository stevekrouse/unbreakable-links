const repoPathFromScriptAttribute = () => {
  const currentScript = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).find(s => s.src.includes('unbreakable-links'))
  return currentScript.getAttribute('repoPath')
}

const load = (repoPath, filePath, commitHash) => {
  const iframe = document.createElement("iframe")
  iframe.src = "https://cdn.rawgit.com/" + repoPath + "/" + commitHash + "/" + filePath
  iframe.height = "100%"
  iframe.width = "100%"
  iframe.styles.border = "none"
  iframe.styles.padding = "none"
  iframe.styles.margin = "none"
  document.body.innerHTML = '';
  document.body.appendChild(iframe)
}

const putCommitHashInURL = commitHash => {
  window.location.hash = commitHash
}

const getMostRecentCommitHash = repoPath => fetch(
  'https://exec.clay.run/steve/github-project-data', {
    method: "POST",
    body: JSON.stringify({
      repo: repoPath,
    })
  })
  .then(response => response.json())
  .then(json => json[0].sha)

window.addEventListener("load", () => {
  const commitHashInURL = window.location.hash.slice(1)
  const repoPath = repoPathFromScriptAttribute() // TODO throw error if undefined
  const [userName, repoName] = repoPath.split("/")
  const repoNameIndexInURLPath = window.location.pathname.indexOf(repoName + "/")
  const filePath = repoNameIndexInURLPath == -1 ? window.location.pathname : window.location.pathname.substring(repoNameIndexInURLPath + repoName.length + 1)

  if (commitHashInURL) {
    load(repoPath, filePath, commitHashInURL)
  } else {
    getMostRecentCommitHash(repoPath).then(putCommitHashInURL)
  }
})