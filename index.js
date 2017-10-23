const repoPathFromScriptAttribute = () => {
  const currentScript = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).find(s => s.src.includes('unbreakable-links'))
  return currentScript.getAttribute('repoPath')
}

const load = (repoPath, filePath, commitHash) => {
  const iframe = document.createElement("iframe")
  iframe.src = "https://cdn.rawgit.com/" + repoPath + "/" + commitHash + "/" + filePath
  iframe.height = "100%"
  iframe.width = "100%"
  iframe.style.border = "none"
  document.body.style.margin = "0px"
  document.body.innerHTML = '';
  document.body.appendChild(iframe)
}

const putCommitHashInURL = commitHash => {
  window.location.hash = commitHash
}

const getMostRecentCommitHashes = (repoPath, filePath) => fetch(
  'https://exec.clay.run/steve/github-project-data', {
    method: "POST",
    body: JSON.stringify({
      repo: repoPath,
      path: filePath
    })
  })
  .then(response => response.json())
  .catch(() => null)


const getFileExists = (repoPath, filePath) => fetch(
  'https://exec.clay.run/steve/github-file-contents', {
    method: "POST",
    body: JSON.stringify({
      repo: repoPath,
      path: filePath
    })
  })
  .then(() => true)
  .catch(() => false)
  
  

const showBanner = (repoPath, filePath, status) => {
  // TODO 
}

window.addEventListener("load", () => {
  const commitHashInURL = window.location.hash.slice(1)
  const repoPath = repoPathFromScriptAttribute()
  if (!repoPath || !repoPath.includes("/")) {
    throw new Error('You need to add a repoPath="" attribute with a valid github repo path to the <script> tag that contains this library. For example for http://github.com/stevekrouse/unbreakable-links, it would be repoPath="stevekrouse/unbreakable-links".') 
  }
  const [userName, repoName] = repoPath.split("/")
  const repoNameIndexInURLPath = window.location.pathname.indexOf(repoName + "/")
  const filePath = repoNameIndexInURLPath == -1 ? window.location.pathname : window.location.pathname.substring(repoNameIndexInURLPath + repoName.length + 1)

  Promise.all([getMostRecentCommitHashes(repoPath, filePath), getFileExists(repoPath, filePath)]).then(([mostRecentCommitHashes, fileExists]) => {
    if (mostRecentCommitHashes == null) {
      showBanner(repoPath, filePath, "FILE-NEVER-EXISTED")
    } else {
      if (fileExists) {
        const mostRecentCommitHash = mostRecentCommitHashes[0].sha
        if (!commitHashInURL) {
          putCommitHashInURL(mostRecentCommitHash)
          load(repoPath, filePath, mostRecentCommitHash)
          showBanner(repoPath, filePath, "UP-TO-DATE")
        } else if (commitHashInURL != mostRecentCommitHash) {
          load(repoPath, filePath, commitHashInURL)
          showBanner(repoPath, filePath, "NEWER-VERSION-AVAILABLE")
        } else {
          load(repoPath, filePath, commitHashInURL)
          showBanner(repoPath, filePath, "UP-TO-DATE")
        }
      } else {
        const mostRecentCommitHash = mostRecentCommitHashes[1].sha
        putCommitHashInURL(mostRecentCommitHash)
        load(repoPath, filePath, mostRecentCommitHash)
        showBanner(repoPath, filePath, "DELETED")
      } 
    }
  })

})