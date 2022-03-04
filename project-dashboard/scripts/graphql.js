/**
 * Methods for Querying GitHub's GraphQL API.
 * 
 * @module
 */

/**
 * Query GitHub API via GraphQL.
 * 
 * @param {Promise<string>} patPromise - GitHub Personal Access Token.
 */
const queryData = async (patPromise) => {
  const pat = await patPromise;

  const graph = graphql('https://api.github.com/graphql', {
    method: 'POST',
    asJSON: true,
    headers: {
      'Authorization': `bearer ${pat}`
    },
  });

  const repoName = 'test-project-management-data';
  const repoOwner = 'BenHenning';

  let repositoryQuery = graph(`query($repoName: String!, $repoOwner: String!, $labels: [String!], $first: Int, $after: String) {
    repository(name: $repoName, owner: $repoOwner) {
      ptis: issues(labels: $labels, first: $first, after: $after) {
        totalCount
        nodes {
          bodyText
          bodyUrl
          number
          milestone {
            title
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

  let allIssuesQuery = graph(`query($repoName: String!, $repoOwner: String!, $first: Int, $after: String) {
    repository(name: $repoName, owner: $repoOwner) {
      all_issues: issues(first: $first, after: $after) {
        totalCount
        nodes {
          number
          title
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

  let milestonesQuery = graph(`query($repoName: String!, $repoOwner: String!, $first: Int, $after: String) {
    repository(name: $repoName, owner: $repoOwner) {
      milestones(first: $first, after: $after) {
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

  let repositories = await repositoryQuery({
    repoName,
    repoOwner,
    labels: 'Type: PTI',
    first: 100,
  });

  let allIssues = await allIssuesQuery({
    repoName,
    repoOwner,
    first: 100,
  });

  let milestones = await milestonesQuery({
    repoName,
    repoOwner,
    first: 100,
  });

  console.log(repositories, allIssues, milestones);
};

export default queryData;
