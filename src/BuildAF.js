import React from "react";
import styled from "styled-components";
import { CX_OFF_WHITE, CX_FONT } from "./Constants.js";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

//URL for the AF team main repo to keep track of 
const AFURL =
 "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/";

//Specific AF team Git build pipeline to keep track of
const AFpipeline =
    "SOAESB_Nightly_Release_Builder";

const Builds = styled.div`
  width: 55vw;
  height: 200px;
  border: solid black 3px;
  border-radius: 20px;
  padding: 20px;
  background-color: ${CX_OFF_WHITE};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  font-size: 2em;
  font-family: ${CX_FONT};
`;

const BuildAFDetail = styled.ul`
    display: flex;
`;

const styles = {
    card : {
        // position: "relative",
        // margin: "20px 0 20px 0"
        top: "20px",
        position:"relative"
    },
    insideCard  : {
        position: "relative",
        // margin: "-5px",
        padding: "5px",
        top: "10px",
        // background: 'red',
        // position: "relative",
        // padding: "5px",
        // margin: "-20 10 0 0",
        // width: "10",
        // // margin: "-20px",
        // display: "flex",
    },
    cardheader : {
        background: '#00ADD2',
    }
}

// const styles = {
//     gridList: {
//         margin: '5px 5px 5px'
//     }
// };

// const bulletPoint = styled


//Reformat extracted time for better display
function extractTime(time) {
    if (time){
        let extractedTime = time.split("T");
        extractedTime = extractedTime[0] + " " + extractedTime[1].split(".")[0];
        return extractedTime;
    }
}

class BuildAF extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          isLoading: true,
          failedData: []
        };
      }

    // updates the build status every 60 sec
    componentDidMount() {
        this.setState({ 
            data: [], 
            isLoading: true,
            failedData: []
             });
        this.refreshBuildStatus();
        setInterval(() => this.refreshBuildStatus(), 60000);
    }

    refreshBuildStatus() {
        this.updateBuildStatus();
    }

    updateBuildStatus() {
        fetch(AFURL+AFpipeline+"/runs/")
            .then(response => response.json())
            .then(jsonData => {
            this.setState({ 
                data: jsonData, 
                isLoading: false, 
                failedData: this.getFailedData(jsonData) });
            })
            .catch(e => console.log("error", e));
    }
    
    //obtain all failed build in Jenkins up to last successful build
    getFailedData(jsonData){
        let failedData = [];
        for (let i = 1; i < jsonData.length; i++){ //NOTICE FIX I = 1 TO I = 0
            if (jsonData[i].result == "SUCCESS"){ break; }
            failedData.push(jsonData[i]);
        }

        return this.trimFailedData(failedData);
    }

    //trim the number of failed build data equals to numOfListItemstoKeep
    //display the most recent failed data equal to numOfLatestItemstoShow
    trimFailedData(failedData){
        let numOfListItemstoKeep = 4;
        let numOfLatestItemstoShow = 2;
        if (failedData.length > numOfListItemstoKeep){
            failedData.splice(numOfLatestItemstoShow, failedData.length-numOfListItemstoKeep, {description: "..."})
        }
        return failedData;
    }

    //return bullet format of failed Data and its content for display
    //if failed data has been trimmed for too many data, it will show ... for trimmed off data.
    getListContents(){
        return (
            <List>               
            {this.state.failedData.map((data, index) =>(
                <ListItem key = {index} >
                    {(data.description === "..." ?
                    <ListItemText
                        primary={"..."}>
                    </ListItemText>
                    :
                    <ListItemText
                        primary={index + " (" + data.result + ") " + (data.description ? data.description: "build title not provided")}
                        secondary={(extractTime(data.startTime)) + " Triggered by " + (data.causes ? (data.causes[0].userId ? data.causes[0].userId : "timer") : "")}>
                    </ListItemText>
                    )}
                </ListItem>
            ))}
            </List>
        )
    }


    render() {
        console.log(this.state.data);
        // console.log("failed dataaa ");
        console.log(this.state.failedData);
        // console.log(this.state.data[0].startTime);
        return this.state.isLoading ? (
          <Card style={styles.card}>Loading. . .</Card>
        ) : (
            <Card style={styles.card}>
                <CardHeader
                    title= {AFpipeline}
                    subheader=
                    {this.state.failedData.map((data,index) =>
                        {return index + " "})}
                    style={styles.cardheader}
                    >
                    {/*
                    style={styles.cardHeader}>
                    style={styles.insideCard}> */}
                </CardHeader>
                {this.getListContents()}
            </Card>
        );
      }
}

export default BuildAF;