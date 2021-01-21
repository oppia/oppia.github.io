// TODO(BenHenning): Add local storage caching support for data.

class DataLoader {
  graphqlFetcher;
  issueRepository = null;
  _ptiQueryResults = {};
  _allIssueQueryResults = {};
  _milestoneResults = {};

  constructor(graphqlFetcher) {
    this.graphqlFetcher = graphqlFetcher;
  }

  get isLoaded() {
    return this.issueRepository != null;
  }

  async load() {
    // Wait for all queries to finish (all must succeed).
    const dataLoader = this;
    return Promise.all([
      this.graphqlFetcher.queryPtis(),
      this.graphqlFetcher.queryAllIssues(),
      this.graphqlFetcher.queryMilestones()
    ]).then(function(resultsArray) {
      dataLoader._ptiQueryResults = resultsArray[0];
      dataLoader._allIssueQueryResults = resultsArray[1];
      dataLoader._milestoneResults = resultsArray[2];
      dataLoader.issueRepository = IssueRepository.createFromGraphql(
        dataLoader._ptiQueryResults, dataLoader._allIssueQueryResults);
      return true;
    });
  }
};
