(async function () {
  const graph = graphql('https://api.github.com/graphql', {
    method: 'POST',
    asJSON: true,
    headers: {
      'Authorization': 'bearer 7329b9bb56f49b69df5e3e1584be9d8bae847fa7'
    },
  });

  const repo_name = 'test-project-management-data';
  const repo_owner = 'BenHenning';

  let repository_query = graph(`query($repo_name: String!, $repo_owner: String!, $labels: [String!], $first: Int, $after: String) {
    repository(name: $repo_name, owner: $repo_owner) {
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

  let all_issues_query = graph(`query($repo_name: String!, $repo_owner: String!, $first: Int, $after: String) {
    repository(name: $repo_name, owner: $repo_owner) {
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

  let milestones_query = graph(`query($repo_name: String!, $repo_owner: String!, $first: Int, $after: String) {
    repository(name: $repo_name, owner: $repo_owner) {
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

  let repositories = await repository_query({
    repo_name,
    repo_owner,
    labels: 'Type: PTI',
    first: 100,
  });

  let all_issues = await all_issues_query({
    repo_name,
    repo_owner,
    first: 100,
  });

  let milestones = await milestones_query({
    repo_name,
    repo_owner,
    first: 100,
  });

  console.log(repositories, all_issues, milestones);
})();
