const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const PTI_ISSUE_LABEL = "Type: PTI";

class GraphqlFetcher {
  _graphqlClient;
  repositoryOwner;
  repositoryName;

  constructor(graphqlClient, repositoryOwner, repositoryName) {
    this._graphqlClient = graphqlClient;
    this.repositoryOwner = repositoryOwner;
    this.repositoryName = repositoryName;
  }

  // TODO(BenHenning): add support for automatic pagination retrieval.

  async queryPtis() {
    const ptiQuery = this._graphqlClient(`query($repo_name: String!, $repo_owner: String!, $labels: [String!], $first: Int, $after: String) {
      repository(name: $repo_name, owner: $repo_owner) {
        ptis: issues(labels: $labels, first: $first, after: $after) {
          totalCount
          nodes {
            bodyText
            number
            milestone {
              number
            }
            title
            url
            projectCards(first: 10) {
              nodes {
                project {
                  name
                  number
                }
                column {
                  name
                }
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }`);
    return ptiQuery({
      repo_name: this.repositoryName,
      repo_owner: this.repositoryOwner,
      labels: PTI_ISSUE_LABEL,
      first: 100
    }).then(result => result.repository.ptis);
  }

  async queryAllIssues() {
    const allIssuesQuery = this._graphqlClient(`query($repo_name: String!, $repo_owner: String!, $first: Int, $after: String) {
      repository(name: $repo_name, owner: $repo_owner) {
        all_issues: issues(first: $first, after: $after) {
          totalCount
          nodes {
            number
            title
            url
            milestone {
              number
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }`);
    return allIssuesQuery({
      repo_name: this.repositoryName,
      repo_owner: this.repositoryOwner,
      first: 100
    }).then(result => result.repository.all_issues);
  }

  async queryMilestones() {
    const milestonesQuery = this._graphqlClient(`query($repo_name: String!, $repo_owner: String!, $first: Int, $after: String) {
      repository(name: $repo_name, owner: $repo_owner) {
        milestones: milestones(first: $first, after: $after) {
          totalCount
          pageInfo {
            hasNextPage
          }
          nodes {
            dueOn
            number
            title
            url
            progressPercentage
          }
        }
      }
    }`);
    return milestonesQuery({
      repo_name: this.repositoryName,
      repo_owner: this.repositoryOwner,
      first: 100
    }).then(result => result.repository.milestones);
  }

  static initialize(accessToken, repositoryOwner, repositoryName) {
    const graphqlClient = graphql("https://api.github.com/graphql", {
      method: "POST",
      asJSON: true,
      headers: {
        "Authorization": `bearer ${accessToken}`
      },
    });
    return new GraphqlFetcher(graphqlClient, repositoryOwner, repositoryName);
  }
}
