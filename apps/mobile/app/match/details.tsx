import { Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { saveMatch } from "../../lib/matches";
import { saveCaptainMatch } from "../../lib/captainMatches";
import { getTeams, Team } from "../../lib/teams";
import { createMatchInvitations } from "../../lib/invitations";

type BallType = "WHITE" | "RED";
const stages = ["League Match", "Quarterfinal", "Semifinal", "Qualifier 1", "Eliminator", "Qualifier 2", "Final"];

function Dropdown({label,value,placeholder,options,onSelect}:{label:string;value:string;placeholder:string;options:string[];onSelect:(value:string)=>void}){
 const [open,setOpen]=useState(false);
 return <View style={styles.field}>
  <Text style={styles.label}>{label}</Text>
  <Pressable onPress={()=>setOpen(v=>!v)} style={[styles.input,styles.dropdown]}>
   <Text style={value?styles.dropdownValue:styles.dropdownPlaceholder}>{value||placeholder}</Text><Text style={styles.chevron}>{open?"⌃":"⌄"}</Text>
  </Pressable>
  {open&&<View style={styles.dropdownMenu}>{options.map(option=><Pressable key={option} onPress={()=>{onSelect(option);setOpen(false);}} style={[styles.dropdownOption,option===value&&styles.dropdownOptionActive]}><Text style={[styles.dropdownOptionText,option===value&&styles.dropdownOptionActiveText]}>{option}</Text>{option===value&&<Text style={styles.check}>✓</Text>}</Pressable>)}</View>}
 </View>;
}

export default function MatchDetailsScreen(){
 const {date,time,timestamp,mode}=useLocalSearchParams<{date?:string;time?:string;timestamp?:string;mode?:string}>();
 const isCaptain=mode==="CAPTAIN";
 const [myTeam,setMyTeam]=useState("");
 const [teams,setTeams]=useState<Team[]>([]);
 const [teamId,setTeamId]=useState("");
 const [ground,setGround]=useState("");
 const [ball,setBall]=useState<BallType>("WHITE");
 const [overs,setOvers]=useState("");
 const [opponent,setOpponent]=useState("");
 const [stage,setStage]=useState("");
 const [selectedPlayers,setSelectedPlayers]=useState<string[]>([]);
 const [showPlayers,setShowPlayers]=useState(false);

 useEffect(()=>{if(isCaptain)getTeams().then(list=>{setTeams(list);if(list[0])setTeamId(list[0].id);});},[isCaptain]);
 const selectedTeam=teams.find(team=>team.id===teamId);
 const togglePlayer=(id:string)=>setSelectedPlayers(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);

 const save=async()=>{
    if((isCaptain?!selectedTeam?.name:!myTeam.trim())||!ground.trim()||!timestamp) return;
   Keyboard.dismiss();
   const savedMatch = {
     id:Date.now().toString(),
     startsAt:new Date(Number(timestamp)).toISOString(),
     date:date||"",
     time:time||"",
     myTeam:isCaptain?selectedTeam!.name:myTeam.trim(),
     ground:ground.trim(),
     ball,
     overs:overs.trim(),
     ...(isCaptain?{teamId:selectedTeam!.id,opponent:opponent.trim(),stage,playerIds:selectedPlayers}: {})
   };
   await (isCaptain?saveCaptainMatch:saveMatch)(savedMatch);
   if(isCaptain && selectedTeam) await createMatchInvitations(savedMatch, selectedTeam.players);
   router.replace(isCaptain?"/captain/home":"/home");
 };

 return <SafeAreaView style={styles.container}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
  <Pressable onPress={()=>router.back()}><Text style={styles.back}>‹  Schedule</Text></Pressable>
  <Text style={styles.eyebrow}>{isCaptain?"CAPTAIN MATCH":"MATCH DETAILS"}</Text>
  <Text style={styles.title}>Set up your game.</Text>
  <Text style={styles.subtitle}>{isCaptain?"Pick your team, add the opposition and build the match squad.":"Add the details your team needs before match day."}</Text>

  <View style={styles.locked}><View><Text style={styles.lockedLabel}>DATE & TIME</Text><Text style={styles.lockedValue}>{date||"Selected date"}</Text><Text style={styles.lockedTime}>{time||"Selected time"}</Text></View><Text style={styles.lock}>LOCKED</Text></View>

  {isCaptain&&<Dropdown label="MY TEAM" value={selectedTeam?.name||""} placeholder="Select your team" options={teams.map(team=>team.name)} onSelect={name=>{const team=teams.find(item=>item.name===name);setTeamId(team?.id||"");setSelectedPlayers([]);}}/>}
  {!isCaptain&&<View style={styles.field}><Text style={styles.label}>MY TEAM</Text><TextInput value={myTeam} onChangeText={setMyTeam} placeholder="e.g. Pahadi Panthers" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>}

  {isCaptain&&<View style={styles.field}><Text style={styles.label}>OPPONENT</Text><TextInput value={opponent} onChangeText={setOpponent} placeholder="e.g. Delhi Strikers" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>}
  {isCaptain&&<Dropdown label="MATCH TYPE" value={stage} placeholder="Select match type" options={stages} onSelect={setStage}/>}

  {isCaptain&&<View style={styles.field}>
   <Pressable onPress={()=>setShowPlayers(v=>!v)} style={styles.addPlayersHeader}><View><Text style={styles.label}>MATCH SQUAD</Text><Text style={styles.addPlayersTitle}>Add players to this match</Text></View><Text style={styles.plus}>{showPlayers?"−":"＋"}</Text></Pressable>
   {showPlayers&&<View style={styles.playerList}>{selectedTeam?.players.length?selectedTeam.players.map(player=><Pressable key={player.id} onPress={()=>togglePlayer(player.id)} style={styles.playerRow}><View style={[styles.checkbox,selectedPlayers.includes(player.id)&&styles.checkboxActive]}><Text style={styles.checkboxText}>{selectedPlayers.includes(player.id)?"✓":""}</Text></View><View style={styles.playerCopy}><Text style={styles.playerName}>{player.name||player.phone}</Text><Text style={styles.playerStatus}>{player.status}</Text></View></Pressable>):<Text style={styles.emptyPlayers}>No players in this team yet. Add players from My Team first.</Text>}</View>}
  </View>}

  <View style={styles.field}><Text style={styles.label}>GROUND / VENUE</Text><TextInput value={ground} onChangeText={setGround} placeholder="e.g. Noida Cricket Ground" placeholderTextColor="#666C78" style={styles.input} returnKeyType="next"/></View>

  <View style={styles.field}><Text style={styles.label}>BALL TYPE</Text><View style={styles.options}>
   <Pressable onPress={()=>setBall("WHITE")} style={[styles.option,ball==="WHITE"&&styles.optionActive]}><View style={styles.ballWhite}/><View style={styles.optionCopy}><Text style={[styles.optionTitle,ball==="WHITE"&&styles.activeText]}>White Ball</Text><Text style={styles.optionSub}>Coloured clothing</Text></View><Text style={styles.radio}>{ball==="WHITE"?"●":"○"}</Text></Pressable>
   <Pressable onPress={()=>setBall("RED")} style={[styles.option,ball==="RED"&&styles.optionActive]}><View style={styles.ballRed}/><View style={styles.optionCopy}><Text style={[styles.optionTitle,ball==="RED"&&styles.activeText]}>Red Ball</Text><Text style={styles.optionSub}>White clothing</Text></View><Text style={styles.radio}>{ball==="RED"?"●":"○"}</Text></Pressable>
  </View></View>

  <View style={styles.field}><Text style={styles.label}>OVERS</Text><TextInput value={overs} onChangeText={v=>setOvers(v.replace(/\D/g,"").slice(0,3))} placeholder="e.g. 20" placeholderTextColor="#666C78" style={styles.input} keyboardType="number-pad" returnKeyType="done" onSubmitEditing={Keyboard.dismiss}/></View>

  <Pressable onPress={save} disabled={!timestamp||!ground.trim()||(!isCaptain&&!myTeam.trim())||(isCaptain&&!selectedTeam)} style={[styles.button,(!timestamp||!ground.trim()||(!isCaptain&&!myTeam.trim())||(isCaptain&&!selectedTeam))&&styles.disabled]}><Text style={styles.buttonText}>Save match  →</Text></Pressable>
  <Text style={styles.note}>{isCaptain?"Players can be updated later from the match.":"You can add players and manage invites after saving the match."}</Text>
 </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:"#0B0D12"},content:{padding:24,paddingBottom:40},back:{fontSize:15,fontWeight:"800",color:"#9CA1AD",marginBottom:30},
 eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.5,color:"#B8FF4A"},title:{marginTop:8,fontSize:38,lineHeight:42,fontWeight:"900",color:"#FFF",letterSpacing:-1},subtitle:{marginTop:12,fontSize:15,lineHeight:22,color:"#858B97"},
 locked:{marginTop:26,borderRadius:18,borderWidth:1,borderColor:"#343844",backgroundColor:"#151821",padding:17,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},lockedLabel:{fontSize:9,fontWeight:"900",letterSpacing:1.4,color:"#777D89"},lockedValue:{marginTop:7,fontSize:17,fontWeight:"900",color:"#FFF"},lockedTime:{marginTop:3,fontSize:13,fontWeight:"700",color:"#B8FF4A"},lock:{fontSize:8,fontWeight:"900",letterSpacing:1,color:"#666C78"},
 field:{marginTop:22},label:{fontSize:10,fontWeight:"900",letterSpacing:1.4,color:"#777D89",marginBottom:9},input:{height:58,borderRadius:16,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",paddingHorizontal:16,fontSize:16,fontWeight:"600",color:"#FFF"},dropdown:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},dropdownValue:{fontSize:16,fontWeight:"700",color:"#FFF"},dropdownPlaceholder:{fontSize:16,fontWeight:"600",color:"#666C78"},chevron:{fontSize:20,color:"#B8FF4A"},dropdownMenu:{marginTop:6,borderRadius:16,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",overflow:"hidden"},dropdownOption:{minHeight:50,paddingHorizontal:15,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderBottomColor:"#242832"},dropdownOptionActive:{backgroundColor:"#171C14"},dropdownOptionText:{fontSize:14,fontWeight:"700",color:"#FFF"},dropdownOptionActiveText:{color:"#B8FF4A"},check:{fontSize:17,fontWeight:"900",color:"#B8FF4A"},
 addPlayersHeader:{minHeight:58,borderRadius:16,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",paddingHorizontal:16,paddingVertical:11,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},addPlayersTitle:{marginTop:2,fontSize:15,fontWeight:"800",color:"#FFF"},plus:{fontSize:24,color:"#B8FF4A"},playerList:{marginTop:7,borderRadius:16,borderWidth:1,borderColor:"#292D38",backgroundColor:"#151821",overflow:"hidden"},playerRow:{minHeight:64,paddingHorizontal:14,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:"#242832"},checkbox:{width:24,height:24,borderRadius:7,borderWidth:1,borderColor:"#555C68",alignItems:"center",justifyContent:"center"},checkboxActive:{backgroundColor:"#B8FF4A",borderColor:"#B8FF4A"},checkboxText:{fontSize:15,fontWeight:"900",color:"#0B0D12"},playerCopy:{marginLeft:11,flex:1},playerName:{fontSize:14,fontWeight:"800",color:"#FFF"},playerStatus:{marginTop:3,fontSize:9,color:"#777D89"},emptyPlayers:{padding:16,fontSize:12,lineHeight:18,color:"#777D89"},
 options:{gap:10},option:{minHeight:72,borderRadius:17,borderWidth:1,borderColor:"#2A2E39",backgroundColor:"#151821",padding:14,flexDirection:"row",alignItems:"center"},optionActive:{borderColor:"#B8FF4A",backgroundColor:"#171C14"},ballWhite:{width:28,height:28,borderRadius:14,backgroundColor:"#FFF",borderWidth:1,borderColor:"#777"},ballRed:{width:28,height:28,borderRadius:14,backgroundColor:"#8F2222",borderWidth:1,borderColor:"#B85A5A"},optionCopy:{flex:1,marginLeft:12},optionTitle:{fontSize:15,fontWeight:"900",color:"#FFF"},activeText:{color:"#B8FF4A"},optionSub:{marginTop:3,fontSize:11,color:"#777D89"},radio:{fontSize:20,color:"#B8FF4A"},
 button:{marginTop:28,height:60,borderRadius:17,backgroundColor:"#B8FF4A",alignItems:"center",justifyContent:"center"},disabled:{opacity:.25},buttonText:{fontSize:16,fontWeight:"900",color:"#0B0D12"},note:{marginTop:13,textAlign:"center",fontSize:11,lineHeight:17,color:"#5F6470"}
});