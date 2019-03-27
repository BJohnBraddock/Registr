import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';

import TurnedIn from '@material-ui/icons/TurnedIn';
import TurnedInNot from '@material-ui/icons/TurnedInNot';

import {periods, days} from './services/UF.js';
import { InformationDrawer } from './InformationDrawer.js'; 

const styles = theme => ({
  calendar: {
    paddingTop: theme.spacing.unit * 1,
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
     this.generateHeaders = this.generateHeaders.bind(this);
     this.generatePeriods = this.generatePeriods.bind(this);
     this.generateTableCell = this.generateTableCell.bind(this);
  }
  generateHeaders(){
    const periodHeader = (<TableCell padding="none"></TableCell>);
    const dayHeaders = days.map((day, key) =>
       <TableCell padding="none"  align="center"  key={key}>{day}</TableCell>
    );
    const headers = [periodHeader, dayHeaders];
    return headers;
  }
  generateTableCell(props){
    let {cell, colSpan, number, key} = props;
    return(
          <TableCell 
          align="center" 
          padding="none"
          rowSpan={cell.periodLength} 
          colSpan={colSpan}
          key={key}
          onClick={()=>this.props.dispatch({
            type:"TOGGLE_INFORMATION_DRAWER", 
            data:{
              number:number,
              information: cell
            }
          })}
          style={{backgroundColor:cell.color }}>
          <Typography variant="h7" style={{color:"white"}}>
            {cell.name}
          </Typography>
          </TableCell>
      )
  }
  generatePeriods(props){
    //Generate everything
    let calendarData = this.props.calendar;//needs to be changed
    const rows = periods.map((period, periodKey) =>
       <TableRow key = {periodKey} style={{height:"35px"}}>
        <TableCell align="center"  padding="none">
          {period}
        </TableCell>
         {days.map((day, dayKey) =>{
            if(calendarData.meetTimes[period] && calendarData.meetTimes[period][day]){
                if(calendarData.meetTimes[period][day].periodLength != 0){
                  return (<this.generateTableCell  key={dayKey} cell={calendarData.meetTimes[period][day]} colSpan={1} number={calendarData.number}/>);
              }else{
                return(null);
              }
            }else{
              return (
                <TableCell padding="none" key={dayKey} />
              )
            }      
          })}
       </TableRow>
    );
    //console.log(calendarData.meetTimes);
    if(calendarData.meetTimes["web"]){

      let web = calendarData.meetTimes["web"].map((data, key)=>
            <TableRow key={key} style={{height:"35px"}}>
              <TableCell align="center"  padding="none">
                Web
              </TableCell>
              <this.generateTableCell key={0} cell={data} colSpan={5} number={calendarData.number}/>
          </TableRow>
        );
      console.log(web);
      rows.push(web);
    }

      
     
    return rows;
  }

  render(){
    if(!this.props.bookMarkOnly || this.props.pinnedCalendar){
      return (
        <div style={{flexDirection: 'row', display:'flex'}}>
            <InformationDrawer number={this.props.calendar.number}/>
          <div  
          style={{padding:4, flex:4, width:'100%', overflow:'hidden'}}>
            <Paper 
              onClick={()=>{
                if(this.props.drawerOpen){
                  this.props.dispatch({
                  type:"TOGGLE_INFORMATION_DRAWER", 
                  data:{
                    number:this.props.calendar.number,
                    information: false
                  }
              })}}}
            >
               <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
                spacing={8}
                className={this.props.classes.root}
              >
                <Grid item xs={8}>
                  <Typography variant="h6" style={{paddingLeft:20}}>
                    Calender Number: {this.props.calendar.number}
                  </Typography>
                </Grid>
                <Grid item xs={1}>

                  {this.props.pinnedCalendar?(<TurnedIn 
                  onClick={()=>this.props.dispatch({
                    type:"TOGGLE_PIN_CALENDAR", 
                    data:{
                      number:this.props.calendar.number,
                      information: false
                    } 
                  })}/>):(<TurnedInNot 
                  onClick={()=>this.props.dispatch({
                    type:"TOGGLE_PIN_CALENDAR", 
                    data:{
                      number:this.props.calendar.number,
                      information: true
                    } 
                  })}/>)}

                </Grid>
              </Grid>
              <Table>
                <colgroup>
                  <col width="10%" />
                  <col width="18%" />
                  <col width="18%" />
                  <col width="18%" />
                  <col width="18%" />
                  <col width="18%" />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <this.generateHeaders></this.generateHeaders>
                  </TableRow>
                </TableHead>
                <TableBody>
                   <this.generatePeriods></this.generatePeriods>
                </TableBody>
              </Table>
              
            </Paper>
          </div>
        </div>
      )}
      else{
        return(null)
      }
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state, ownProps) => {
  return {
    drawerOpen: state.calendarDrawers[ownProps.calendar.number],
    pinnedCalendar: state.pinnedCalendars[ownProps.calendar.number],
    bookMarkOnly: state.bookMarkOnly,
  }
}
const AppWithStyles = withStyles(styles)(App);
const Calendar = connect(mapStateToProps, null)(AppWithStyles);

export { Calendar }
