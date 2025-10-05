// GitHub API helper functions

export async function fetchGitHubRepoData(owner: string, repo: string) {
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchGitHubIssue(owner: string, repo: string, issueNumber: number) {
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchGitHubPullRequest(owner: string, repo: string, prNumber: number) {
  const token = process.env.GITHUB_TOKEN

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/vnd.github.v3+json",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export async function createGitHubComment(owner: string, repo: string, issueNumber: number, body: string) {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error("GitHub token not configured")
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}
