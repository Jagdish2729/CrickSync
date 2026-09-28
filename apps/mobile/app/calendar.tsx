import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { router } from "expo-router";

type Mode = "WEEK" | "MONTH";

const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function startOfSundayWeek(date:Date){
  const d=new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate()-d.getDay());
  return d;
}
function sameDay(a:Date,b:Date){
  return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
}

export default function CalendarScreen(){
 const [mode,setMode]=useState<Mode>("WEEK");
 const today=useMemo(()=>new Date(),[]);
 const weekStart=useMemo(()=>startOfSundayWeek(today),[today]);
 const weekDays=useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d}),[weekStart]);
 const monthDays=useMemo(()=>{
   const first=new Date(today.getFullYear(),today.getMonth(),1);
   const start=startOfSundayWeek(first);
   return Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
 },[today]);

 const weekEnd=new Date(weekStart);weekEnd.setDate(weekStart.getDate()+6);
 const range=mode==="WEEK"
   ? `${weekStart.getDate()} ${monthNames[weekStart.getMonth()].slice(0,3)} — ${weekEnd.getDate()} ${monthNames[weekEnd.getMonth()].slice(0,3)}`
   : `${monthNames[today.getMonth()]} ${today.getFullYear()}`;

 return <SafeAreaView style={styles.container}>
  <View style={styles.content}>
   <View style={styles.header}>
    <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹</Text></Pressable>
    <View style={styles.headerCopy}><Text style={styles.eyebrow}>MY CRICKET</Text><Text style={styles.title}>Calendar</Text></View>
   </View>

   <View style={styles.switch}>
    <Pressable onPress={()=>setMode("WEEK")} style={[styles.switchItem,mode==="WEEK"&&styles.switchActive]}><Text style={[styles.switchText,mode==="WEEK"&&styles.switchTextActive]}>Week</Text></Pressable>
    <Pressable onPress={()=>setMode("MONTH")} style={[styles.switchItem,mode==="MONTH"&&styles.switchActive]}><Text style={[styles.switchText,mode==="MONTH"&&styles.switchTextActive]}>Month</Text></Pressable>
   </View>

   <Text style={styles.range}>{range}</Text>

   {mode==="WEEK" ? <View style={styles.weekCard}>
    {weekDays.map((date)=> <View key={date.toISOString()} style={[styles.dayRow,sameDay(date,today)&&styles.todayRow]}>
      <View style={styles.dateBox}><Text style={styles.dayName}>{dayNames[date.getDay()]}</Text><Text style={[styles.dateNumber,sameDay(date,today)&&styles.todayNumber]}>{date.getDate()}</Text></View>
      <View style={styles.emptySlot}><Text style={styles.emptyText}>No match scheduled</Text></View>
    </View>)}
   </View> : <View style={styles.monthCard}>
     <View style={styles.monthHeader}>{dayNames.map(d=><Text key={d} style={styles.monthDayName}>{d[0]}</Text>)}</View>
     <View style={styles.grid}>{monthDays.map((date)=>{
       const inMonth=date.getMonth()===today.getMonth();
       const isToday=sameDay(date,today);
       return <View key={date.toISOString()} style={styles.cell}>
        <View style={[styles.cellCircle,isToday&&styles.todayCircle]}><Text style={[styles.cellText,!inMonth&&styles.muted,isToday&&styles.todayCellText]}>{date.getDate()}</Text></View>
       </View>
     })}</View>
   </View>}

   <View style={styles.footer}><Text style={styles.footerDot}>●</Text><Text style={styles.footerText}>Your confirmed matches will appear here.</Text></View>
  </View>
 </SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{flex:1,paddingHorizontal:20,paddingTop:18},
 header:{flexDirection:"row",alignItems:"center"},back:{fontSize:38,lineHeight:38,color:"#FFF",fontWeight:"300",paddingRight:14},headerCopy:{marginLeft:2},eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:2,fontSize:28,fontWeight:"900",color:"#FFF"},
 switch:{marginTop:28,height:46,borderRadius:14,backgroundColor:"#151821",padding:4,flexDirection:"row",borderWidth:1,borderColor:"#292D38"},switchItem:{flex:1,borderRadius:11,alignItems:"center",justifyContent:"center"},switchActive:{backgroundColor:"#B8FF4A"},switchText:{fontSize:14,fontWeight:"800",color:"#777D89"},switchTextActive:{color:"#0B0D12"},
 range:{marginTop:22,fontSize:19,fontWeight:"900",color:"#FFF"},weekCard:{marginTop:14,borderRadius:20,overflow:"hidden",borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821"},
 dayRow:{minHeight:62,borderBottomWidth:1,borderBottomColor:"#292D38",flexDirection:"row",alignItems:"center",paddingHorizontal:14},todayRow:{backgroundColor:"#171C14"},dateBox:{width:62,flexDirection:"row",alignItems:"center",gap:8},dayName:{fontSize:11,fontWeight:"800",color:"#777D89"},dateNumber:{fontSize:18,fontWeight:"900",color:"#FFF"},todayNumber:{color:"#B8FF4A"},emptySlot:{flex:1,alignItems:"flex-end"},emptyText:{fontSize:11,color:"#555B68"},
 monthCard:{marginTop:14,borderRadius:20,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",padding:10},monthHeader:{flexDirection:"row",marginBottom:6},monthDayName:{flex:1,textAlign:"center",fontSize:10,fontWeight:"900",color:"#777D89"},grid:{flexDirection:"row",flexWrap:"wrap"},cell:{width:"14.2857%",height:48,alignItems:"center",justifyContent:"center"},cellCircle:{width:32,height:32,borderRadius:16,alignItems:"center",justifyContent:"center"},todayCircle:{backgroundColor:"#B8FF4A"},cellText:{fontSize:13,fontWeight:"800",color:"#FFF"},todayCellText:{color:"#0B0D12"},muted:{color:"#454B56"},
 footer:{marginTop:18,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:8},footerDot:{fontSize:8,color:"#B8FF4A"},footerText:{fontSize:11,color:"#666C78"}
});