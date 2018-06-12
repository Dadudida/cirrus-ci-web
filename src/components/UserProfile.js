import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom'
import {createFragmentContainer, graphql} from 'react-relay';
import Paper from '@material-ui/core/Paper';
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Typography from "@material-ui/core/Typography/Typography";
import CardActions from "@material-ui/core/CardActions/CardActions";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import Icon from "@material-ui/core/Icon/Icon";
import {cirrusColors} from "../cirrusTheme";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import classNames from 'classnames';


const styles = theme => ({
  title: {
    backgroundColor: cirrusColors.cirrusGrey
  },
  settingGap: {
    paddingTop: 16
  },
  gap: {
    paddingTop: 16
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

const PERSONAL_PRIVATE_REPOSITORIES_PLAN_ID = 992;

class UserProfile extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let {user, classes} = this.props;
    let githubMarketplaceComponent = (
      <div>
        <Typography variant="subheading">
          No GitHub Marketplace plan has been configured!
        </Typography>
      </div>
    );
    let actionButton = (
      <Button variant="contained"
              href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTI=?account=${user.githubUserName}`}>
        <Icon className={classNames(classes.leftIcon, "fa", "fa-github")}/>
        Purchase Plan for Private Repositories
      </Button>
    );
    if (user.githubMarketplacePurchase) {
      githubMarketplaceComponent = (
        <div className={classes.row}>
          <Typography variant="subheading">
            Purchased GitHub Plan: <b>{user.githubMarketplacePurchase.planName}</b>
          </Typography>
        </div>
      );
    }
    if (user.githubMarketplacePurchase && user.githubMarketplacePurchase.planId === PERSONAL_PRIVATE_REPOSITORIES_PLAN_ID) {
      actionButton = (
        <Button variant="contained"
                href={`https://github.com/marketplace/cirrus-ci/order/MDIyOk1hcmtldHBsYWNlTGlzdGluZ1BsYW45OTA=?account=${user.githubUserName}`}>
          <Icon className={classNames(classes.leftIcon, "fa", "fa-github")}/>
          Switch to Free Plan
        </Button>
      );
    }

    return (
      <div>
        <Paper elevation={1}>
          <Toolbar className={classes.title}>
            <Typography variant="title" color="inherit">
              Profile Settings
            </Typography>
          </Toolbar>
        </Paper>
        <div className={classes.settingGap}/>
        <Paper elevation={1}>
          <Card>
            <CardHeader title="GitHub Settings"/>
            <CardContent>
              {githubMarketplaceComponent}
            </CardContent>
            <CardActions>
              {actionButton}
            </CardActions>
          </Card>
        </Paper>
      </div>
    );
  }
}

export default createFragmentContainer(withRouter(withStyles(styles)(UserProfile)), {
  user: graphql`
    fragment UserProfile_user on User {
      id
      githubUserName
      githubMarketplacePurchase {
        accountId
        planId
        planName
      }
    }
  `,
});
