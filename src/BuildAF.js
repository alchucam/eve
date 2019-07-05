import React from "react";
import styled from "styled-components";
import { CX_OFF_WHITE, CX_FONT } from "./Constants.js";

const AFURL =
 "https://jenkins.phx.connexta.com/service/jenkins/blue/rest/organizations/jenkins/pipelines/HAART-Jobs/pipelines/SOAESB_Nightly_Release_Builder/runs/";

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

const bulletPoint = styled

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
        fetch(AFURL)
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
        console.log(jsonData);
        let failedData = [];
        for (let i = 0; i < jsonData.length; i++){
            if (jsonData[i].result == "SUCCESS"){ break; }
            failedData.push(jsonData[i]);
        }
        return failedData;
    }


    render() {
        // console.log(this.state.data);
        // console.log("failed dataaa ");
        // console.log(this.state.failedData);

        return this.state.isLoading ? (
          <Builds>Loading. . .</Builds>
        ) : (
          <Builds>
            <BuildAFDetail>
                {this.state.failedData.map((data, index) => 
                    {return data.description}
                )}
            </BuildAFDetail>
          </Builds>
        );
      }
}

export default BuildAF;