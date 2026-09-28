import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { router } from "expo-router";

type Mode = "WEEK" | "MONTH";
const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const hours=Array.from({length:24},(_,i)=>i);
function startOfSundayWeek(date:Date){const d=new Date(date);d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay());return d;}
function sameDay(a:Date,b:Date){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
function formatDate(d:Date){return `${d.getDate()} ${monthNames[d.getMonth()].slice(0,3)}`;}
function formatHour(hour:number){if(hour===0)return "12 AM";if(hour===12)return "12 PM";return `${hour>12?hour-12:hour} ${hour<12?"AM":"PM"}`;}

export default function CalendarScreen(){
 const [mode,setMode]=useState<Mode>("WEEK"); const today=useMemo(()=>new Date(),[]);
 const weekStart=useMemo(()=>startOfSundayWeek(today),[today]);
 const weekDays=useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d}),[weekStart]);
 const monthDays=useMemo(()=>{const first=new Date(today.getFullYear(),today.getMonth(),1);const start=startOfSundayWeek(first);return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});},[today]);
 const weekEnd=new Date(weekStart);weekEnd.setDate(weekStart.getDate()+6);
 const range=mode==="WEEK"?`${formatDate(weekStart)} — ${formatDate(weekEnd)}`:`${monthNames[today.getMonth()]} ${today.getFullYear()}`;
 const openSlot=(date:Date,hour:number)=>{const selected=new Date(date);selected.setHours(hour,0,0,0);router.push({pathname:"/match/create",params:{date:selected.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"}),time:selected.toLocaleTimeString("en-IN",{hour:"numeric",minute:"2-digit"})}});};

 return <SafeAreaView style={styles.container}><View style={styles.content}>
  <View style={styles.header}><Pressable onPress={()=>router.back()}><Text style={styles.back}>‹</Text></Pressable><View style={styles.headerCopy}><Text style={styles.eyebrow}>MY CRICKET</Text><Text style={styles.title}>Calendar</Text></View></View>
  <View style={styles.switch}><Pressable onPress={()=>setMode("WEEK")} style={[styles.switchItem,mode==="WEEK"&&styles.switchActive]}><Text style={[styles.switchText,mode==="WEEK"&&styles.switchTextActive]}>Week</Text></Pressable><Pressable onPress={()=>setMode("MONTH")} style={[styles.switchItem,mode==="MONTH"&&styles.switchActive]}><Text style={[styles.switchText,mode==="MONTH"&&styles.switchTextActive]}>Month</Text></Pressable></View>
  <Text style={styles.range}>{range}</Text>
  {mode==="WEEK" ? <View style={styles.calendarWrap}><View style={styles.daysHeader}><View style={styles.timeGutter}/>{weekDays.map(d=><View key={d.toISOString()} style={[styles.dayHeader,sameDay(d,today)&&styles.todayHeader]}><Text style={styles.dayName}>{dayNames[d.getDay()]}</Text><Text style={[styles.dayNumber,sameDay(d,today)&&styles.todayNumber]}>{d.getDate()}</Text></View>)}</View>
   <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.timeBody}>{hours.map(hour=><View key={hour} style={styles.hourRow}><View style={styles.timeLabel}><Text style={styles.timeText}>{formatHour(hour)}</Text></View>{weekDays.map(date=><Pressable key={date.toISOString()+hour} onPress={()=>openSlot(date,hour)} style={({pressed})=>[styles.slot,sameDay(date,today)&&styles.todaySlot,pressed&&styles.slotPressed]}><View style={styles.slotLine}/></Pressable>)}</View>)}</ScrollView>
  </View> : <ScrollView showsVerticalScrollIndicator={false}><View style={styles.monthCard}><View style={styles.monthHeader}>{dayNames.map(d=><Text key={d} style={styles.monthDayName}>{d[0]}</Text>)}</View><View style={styles.grid}>{monthDays.map(date=>{const inMonth=date.getMonth()===today.getMonth();const isToday=sameDay(date,today);return <Pressable key={date.toISOString()} onPress={()=>openSlot(date,9)} style={styles.cell}><View style={[styles.cellCircle,isToday&&styles.todayCircle]}><Text style={[styles.cellText,!inMonth&&styles.muted,isToday&&styles.todayCellText]}>{date.getDate()}</Text></View></Pressable>})}</View></View></ScrollView>}
  <View style={styles.footer}><Text style={styles.footerDot}>●</Text><Text style={styles.footerText}>12 AM — 11 PM · Tap any slot to schedule.</Text></View>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:14,paddingTop:14},header:{flexDirection:"row",alignItems:"center",paddingHorizontal:6},back:{fontSize:38,lineHeight:38,color:"#FFF",fontWeight:"300",paddingRight:12},headerCopy:{marginLeft:2},eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:2,fontSize:28,fontWeight:"900",color:"#FFF"},
 switch:{marginTop:20,height:44,borderRadius:13,backgroundColor:"#151821",padding:4,flexDirection:"row",borderWidth:1,borderColor:"#292D38"},switchItem:{flex:1,borderRadius:10,alignItems:"center",justifyContent:"center"},switchActive:{backgroundColor:"#B8FF4A"},switchText:{fontSize:14,fontWeight:"800",color:"#777D89"},switchTextActive:{color:"#0B0D12"},range:{marginTop:17,marginBottom:10,paddingHorizontal:6,fontSize:18,fontWeight:"900",color:"#FFF"},
 calendarWrap:{flex:1,borderWidth:1,borderColor:"#292D38",borderRadius:18,overflow:"hidden",backgroundColor:"#151821"},daysHeader:{height:58,flexDirection:"row",borderBottomWidth:1,borderBottomColor:"#292D38"},timeGutter:{width:50},dayHeader:{flex:1,alignItems:"center",justifyContent:"center",borderLeftWidth:1,borderLeftColor:"#292D38"},todayHeader:{backgroundColor:"#171C14"},dayName:{fontSize:9,fontWeight:"900",color:"#777D89"},dayNumber:{marginTop:3,fontSize:15,fontWeight:"900",color:"#FFF"},todayNumber:{color:"#B8FF4A"},
 timeBody:{paddingBottom:20},hourRow:{height:64,flexDirection:"row"},timeLabel:{width:50,alignItems:"center",paddingTop:7},timeText:{fontSize:8,fontWeight:"800",color:"#666C78"},slot:{flex:1,borderLeftWidth:1,borderLeftColor:"#292D38",borderBottomWidth:1,borderBottomColor:"#292D38",position:"relative"},todaySlot:{backgroundColor:"#10150E"},slotLine:{position:"absolute",left:0,right:0,top:31,borderTopWidth:1,borderTopColor:"#242832"},slotPressed:{backgroundColor:"#28341E"},
 monthCard:{marginTop:4,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:10},monthHeader:{flexDirection:"row",marginBottom:6},monthDayName:{flex:1,textAlign:"center",fontSize:10,fontWeight:"900",color:"#777D89"},grid:{flexDirection:"row",flexWrap:"wrap"},cell:{width:"14.2857%",height:48,alignItems:"center",justifyContent:"center"},cellCircle:{width:32,height:32,borderRadius:16,alignItems:"center",justifyContent:"center"},todayCircle:{backgroundColor:"#B8FF4A"},cellText:{fontSize:13,fontWeight:"800",color:"#FFF"},todayCellText:{color:"#0B0D12"},muted:{color:"#454B56"},footer:{paddingVertical:10,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:7},footerDot:{fontSize:7,color:"#B8FF4A"},footerText:{fontSize:10,color:"#666C78"}
});