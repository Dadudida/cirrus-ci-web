import PropTypes from 'prop-types';
import React from 'react';
import {createFragmentContainer, graphql,} from 'react-relay';
import {withRouter} from 'react-router-dom'
import ReactMarkdown from 'react-markdown';

import {Table, TableBody, TableRow, TableRowColumn,} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RepositoryNameChip from "./chips/RepositoryNameChip";
import BuildBranchNameChip from "./chips/BuildBranchNameChip";
import BuildStatusChip from "./chips/BuildStatusChip";
import BuildChangeChip from "./chips/BuildChangeChip";
import {navigateBuild} from "../utils/navigate";


class ViewerBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
      chip: {
        margin: 4,
      },
      emptyBuilds: {
        margin: 8,
      },
    };

    let builds = this.props.viewer.builds;

    let buildsComponent = (
      <Table selectable={false} style={{tableLayout: 'auto'}}>
        <TableBody displayRowCheckbox={false} showRowHover={true}>
          {builds && builds.edges.map(edge => this.buildItem(edge.node, styles))}
        </TableBody>
      </Table>
    );
    if (!builds || builds.edges.length === 0) {
      buildsComponent = (
        <div style={styles.emptyBuilds}>
          <ReactMarkdown
            source="No recent builds! Please check [documentation](https://cirrus-ci.org/) on how to start with Cirrus CI."/>
        </div>
      );
    }
    return (
      <div style={styles.main} className="container">
        <Paper zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="Recent Builds"/>
            </ToolbarGroup>
          </Toolbar>
          {buildsComponent}
        </Paper>
      </div>
    );
  }

  buildItem(build, styles) {
    return (
      <TableRow key={build.id}
                onMouseDown={(e) => navigateBuild(this.context.router, e, build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn style={{padding: 0}}>
          <RepositoryNameChip repository={build.repository} style={styles.chip}/>
          <BuildBranchNameChip build={build} style={styles.chip}/>
          <BuildChangeChip build={build} style={styles.chip}/>
          <BuildStatusChip build={build} style={styles.chip} className="hidden-lg-up"/>
        </TableRowColumn>
        <TableRowColumn style={{maxWidth: '100%', maxWidth: 600}}>
          <div className="card-block">
            <ReactMarkdown className="card-text" source={build.changeMessage}/>
          </div>
        </TableRowColumn>
        <TableRowColumn style={{padding: 0}} className="hidden-md-down">
          <BuildStatusChip build={build} style={styles.chip}/>
        </TableRowColumn>
      </TableRow>
    );
  }
}

export default createFragmentContainer(withRouter(ViewerBuildList), {
  viewer: graphql`
    fragment ViewerBuildList_viewer on User {
      builds(last: 100) {
        edges {
          node {
            id
            branch
            changeIdInRepo
            changeMessage
            durationInSeconds
            status
            changeTimestamp
            repository {
              owner
              name
            }
          }
        }
      }
    }
  `,
});
