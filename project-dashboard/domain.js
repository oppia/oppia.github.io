String.prototype.normalize = function() {
  return this.trim().replaceAll(/\s{2,}/, " ");
};

let _parseIssuesFromTitle = function(issueTitle, expectedPrefixes) {
  const pattern = new RegExp(
    `\\[(${expectedPrefixes.join("|")}):(#\\d+(,?#\\d+)*)\\]`, 'i');
  const issueMatches = issueTitle.replaceAll(/\s/g, "").match(pattern);
  if (issueMatches == null || issueMatches.length < 3) {
    return []; // No issues are contained in the issue title.
  }
  // Retrieve just the group which corresponds to the list of issues.
  const issueNumbers = issueMatches[2].split(",");
  return issueNumbers.map(issueReference => issueReference.substr(1));
};

let _parseBlockingIssueFromTitle = function(issueTitle) {
  return _parseIssuesFromTitle(issueTitle, ["blocking"]);
};

let _parseBlockedIssueFromTitle = function(issueTitle) {
  return _parseIssuesFromTitle(issueTitle, ["blocked", "blockedby"]);
};

class Issue {
  id;
  title;
  bodyText;
  url;
  blockingIssueNumbers;
  blockedIssueNumbers;
  projectIds;
  projectStages;
  milestoneId;

  constructor(
      id, title, bodyText, url, blockingIssueNumbers, blockedIssueNumbers,
      projectIds, projectStages, milestoneId) {
    this.id = id;
    this.title = title;
    this.bodyText = bodyText;
    this.url = url;
    this.blockingIssueNumbers = blockingIssueNumbers;
    this.blockedIssueNumbers = blockedIssueNumbers;
    this.projectIds = projectIds;
    this.projectStages = projectStages;
    this.milestoneId = milestoneId;
  }

  static createFromGraphql(issueObject) {
    const id = issueObject.number;
    const title = issueObject.title;
    const bodyText = issueObject.bodyText;
    const url = issueObject.url;
    const blockingIssueNumbers = _parseBlockingIssueFromTitle(title);
    const blockedIssueNumbers = _parseBlockedIssueFromTitle(title);
    const projectCards = (issueObject.projectCards || {}).nodes || [];
    const projectIds = projectCards.map(card => card.project.number);
    const projectStages = projectCards.map(card => card.column.name);
    const milestoneId = (issueObject.milestone || {}).number;
    return new Issue(
      id, title, bodyText, url, blockingIssueNumbers, blockedIssueNumbers,
      projectIds, projectStages, milestoneId);
  }
}

class IssueRepository {
  issueMap;

  constructor(issueMap) {
    this.issueMap = issueMap;
  }

  retrieveIssue(number) {
    return this.issueMap.get(number);
  }

  static createFromGraphql(ptisObject, allIssuesObject) {
    const ptiIssues = ptisObject.nodes.map(
      ptiNode => Issue.createFromGraphql(ptiNode));
    const ptiIssueIds = ptiIssues.map(ptiIssue => ptiIssue.id);
    const nonPtiIssueNodes = allIssuesObject.nodes.filter(
      node => !ptiIssueIds.includes(node.number));
    const nonPtiIssues = nonPtiIssueNodes.map(
      issueNode => Issue.createFromGraphql(issueNode));
    const issueMap = new Map();
    for (const ptiIssue of ptiIssues) {
      issueMap.set(ptiIssue.id, ptiIssue);
    }
    for (const nonPtiIssue of nonPtiIssues) {
      issueMap.set(nonPtiIssue.id, nonPtiIssue);
    }
    return new IssueRepository(issueMap);
  };
};
