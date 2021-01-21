/**
 * @fileoverview General definitions for the domain layer of the project
 * dashboard. See the following diagram for an organizational breakdown of all
 * the different structures present in the layer, their relationships, and how
 * they correspond to data defined on GitHub.
 *
 *                            +---------------+
 *                            |    Product    |
 *          +-----------------| (GitHub Repo) |---------------------+
 *          |                 +-------+-------+                     |
 *          |                         |                             |
 *          |                         |                             |
 * +--------v--------+     +----------v----------+    +-------------v----------+
 * |  Product Board  |     |      Product        |    |                        |
 * |     (GitHub     |     |     Milestones      |    |      Team Boards       |
 * | Project Board)  |     | (GitHub Milestones) |    |(GitHub Project Boards) |
 * |                 |     |                     |    |                        |
 * +-----------------+     +---------------------+    +------------------------+
 *          |                 |                |       |                  |
 *          |                 |                |       |                  |
 *          |            +----v------------+   |       | +----------------v----+
 *          |            |  Bugs + Misc.   |   |       | |     Bugs + Misc.    |
 *          |            | (GitHub Issues) |   |       | |   (GitHub Issues)   |
 *          |            +-----------------+   |       | +---------------------+
 *          |                                  |       |
 *          +------------------------------------------+
 *                                   |
 *                                   |
 *                     +-------------|-------------+
 *                     |Projects     |             |
 *                     |             |             |
 *                     |             |             |
 *                     |  +----------v----------+  |
 *                     |  |    PTI: Project     |  |
 *                     |  |   Tracking Issue    |  |
 *                     |  |   (GitHub Issue)    |  |
 *                     |  +---------------------+  |
 *                     |             |             |
 *                     |             |             |
 *                     |  +----------v----------+  |
 *                     |  | Project Milestones  |  |
 *                     |  | (GitHub Milestones) |  |
 *                     |  +---------------------+  |
 *                     |             |             |
 *                     |             |             |
 *                     |  +----------v----------+  |
 *                     |  |    Bugs + Tasks     |  |
 *                     |  |   (GitHub Issues)   |  |
 *                     |  +---------------------+  |
 *                     |                           |
 *                     +---------------------------+
 */

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

/** Represents an issue filed on GitHub. */
class Issue {
  /** {String} - The issue number. */
  id;

  /** {String} - The title of the issue. */
  title;

  /** {String} - The body text of the issue's opening comment. */
  bodyText;

  /** {String} - A URL directly to the issue on GitHub. */
  url;

  /**
   * {Array} - An array of strings corresponding to issue numbers that are
   * blocking this issue.
   */
  blockingIssueNumbers;

  /**
   * {Array} - An array of strings corresponding to issue numbers that are
   * blocked by this issue.
   */
  blockedIssueNumbers;

  constructor(
      id, title, bodyText, url, blockingIssueNumbers, blockedIssueNumbers) {
    this.id = id;
    this.title = title;
    this.bodyText = bodyText;
    this.url = url;
    this.blockingIssueNumbers = blockingIssueNumbers;
    this.blockedIssueNumbers = blockedIssueNumbers;
  }

  /**
   * Creates a new issue object from a GraphQL-derived object. Note that this is
   * heavily dependent on the query used to fetch the GraphQL data.
   *
   * @param {Object} issueObject - An object containing GraphQL query results
   *     for a single issue.
   * @return {Issue} - The derived issue object.
   **/
  static createFromGraphql(issueObject) {
    const id = issueObject.number;
    const title = issueObject.title;
    const bodyText = issueObject.bodyText;
    const url = issueObject.url;
    const blockingIssueNumbers = _parseBlockingIssueFromTitle(title);
    const blockedIssueNumbers = _parseBlockedIssueFromTitle(title);
    const projectCards = (issueObject.projectCards || {}).nodes || [];
    // const projectIds = projectCards.map(card => card.project.number);
    // const projectStages = projectCards.map(card => card.column.name);
    // const milestoneId = (issueObject.milestone || {}).number;
    return new Issue(
      id, title, bodyText, url, blockingIssueNumbers, blockedIssueNumbers);
  }
}

/**
 * Represents a repository used for retrieving & performing operations on
 * issues.
 */
class IssueRepository {
  /** {Map} - A map from issue ID (String) to Issue. */
  issueMap;

  constructor(issueMap) {
    this.issueMap = issueMap;
  }

  /**
   * Returns an [Issue] corresponding to the specified issue number.
   *
   * @param {String} number - The issue number.
   * @return {Issue} - The retrieved issue, or null if there is none
   *     corresponding to the specified number.
   */
  retrieveIssue(number) {
    return this.issueMap.get(number);
  }

  /**
   * Creates a new issue repository from the results of specific GraphQL
   * queries.
   *
   * @param {Object} ptisObject - An object containing GraphQL query results for
   *     all project tracking issues (PTIs) in the connected repository.
   * @param {Object} allIssuesObject - An object containing GraphQL query results
   *     for all issues in the connected repository.
   * @return {IssueRepository} - The derived issue repository object.
   **/
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

/** Corresponds to a milestone that's part of a broader project. */
class ProjectMilestone {
  milestoneId;
  estimatedDurationDays;
}

class Project {
  id;
  title;
  description;
  projectLead;
  productManagers;
  technicalLead;
  productStage;
  productMilestoneId;
  teamId;
  projectMilestones;
  estimatedStartDate;
  actualStartDate;
  roughEstimatedProjectDurationDays;
  estimatedProductDesignDurationDays;
  estimatedTechnicalDesignDurationDays;
  estimatedVerificationDurationDays;
  actualFinishDate;
}

class ProjectDatabase {
  projectMap;

  // TODO(jasamina13): Add support for:
  // - Retrieving dependent issues for a project.
  // - Retrieving dependent projects for a project.
}

export const MilestoneType = Object.freeze({
  UNKNOWN: 0,
  PRODUCT: 1,
  PROJECT: 2
});

class Milestone {
  id;
  url;
  title;
  description;
  progressPercentage;
  issueIds;
}

class MilestoneRepository {
  milestoneMap;
}

class Team {
  id;
  projectBoardUrl;
  teamName;
}

class TeamRepository {
  teamMap;
}
