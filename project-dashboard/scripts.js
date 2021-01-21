// TODO(BenHenning): Add input & local storage support for the PAT.
const personalAccessToken = "";
// TODO(BenHenning): Switch the repository over to Oppia Android once ready.
const repoOwner = "BenHenning";
const repoName = "test-project-management-data";

const graphqlFetcher = GraphqlFetcher.initialize(
  personalAccessToken, repoOwner, repoName);
const dataLoader = new DataLoader(graphqlFetcher);
dataLoader.load().then(function(succeeded) {
  console.log("Successfully loaded repository", dataLoader.issueRepository);
}).catch(function(error) {
  // TODO(BenHenning): Add dashboard error messaging.
  console.log("Failed to execute GraphQL retrieval:", error);
});
