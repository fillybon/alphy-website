import React, { useEffect, useState, useRef } from 'react';
import QuestionAnswering from '../QuestionAnswering';
import srtParser2 from 'srt-parser-2';
import { Tab, Tabs } from 'react-bootstrap';
import Twitter from '../../../img/twitter_spaces.png';
import Loading from '../../Loading';
import working from './working.svg';

import axios from 'axios';

import { useWindowSize } from '../../../hooks/useWindowSize';
import { saveAs } from 'file-saver'; // library to save file as blob
import {useAuth} from "../../../hooks/useAuth"
import DownloadStatic from '../../../img/download_static.png';
import ReactMarkdown from "react-markdown";


import {
	Popover,
	PopoverHandler,
	PopoverContent,
	ThemeProvider,
	Select,
	Option
  } from "@material-tailwind/react";


export default function Content(props) {
	
	
	const [loading, setLoading] = useState(false);
	const windowSize = useWindowSize();
	const [isLoading, setIsLoading] = useState(props.data.transcript === undefined);
	const [cautionaryTimeoutPassed, setCautionaryTimeoutPassed] = useState(false);
	const [activeTab, setActiveTab] = useState('tab1');
	const [autoplay, setAutoplay] = useState(0);
	const [timestamp, setTimestamp] = useState();
	const [showButton, setShowButton] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [basicDataLoaded, setBasicDataLoaded] = useState(false);
	
	

	

	const [language, setLanguage] = useState(props.data.summaries !== undefined &&  props.data.summaries.length > 1 && props.data.lang!==undefined ? props.data.summaries[0].lang : 'en')
	
	
	const [translationMessage, setTranslationMessage] = useState(false);
	const[errorMessage, setErrorMessage] = useState(false);
	const [translatingLanguage, setTranslatingLanguage] = useState("");
	const [languagesWanted, setLanguagesWanted] = useState([]);
	const {currentUser} = useAuth()
	

	

	const data = props.data
	
	let contentSummaries = []
	let languages =[]
	let summary=""
	



	
	const transcript_raw = props.data.transcript;
	const theme = localStorage.getItem("theme")
	
	const ref = useRef(null);
	let transcript = [];


	
	let summaryArray = '';

	const language_codes = {
		"__":"__dummy",
		"af": "Afrikaans",
		"ar": "العربية",
		"hy": "Հայերեն",
		"az": "Azərbaycan dili",
		"be": "Беларуская",
		"bs": "Bosanski",
		"bg": "Български",
		"ca": "Català",
		"zh": "中文",
		"hr": "Hrvatski",
		"cs": "Čeština",
		"da": "Dansk",
		"nl": "Nederlands",
		"en": "English",
		"et": "Eesti",
		"fi": "Suomi",
		"fr": "Français",
		"gl": "Galego",
		"de": "Deutsch",
		"el": "Ελληνικά",
		"he": "עברית",
		"hi": "हिन्दी",
		"hu": "Magyar",
		"is": "Íslenska",
		"id": "Bahasa Indonesia",
		"it": "Italiano",
		"ja": "日本語",
		"kn": "ಕನ್ನಡ",
		"kk": "Қазақ",
		"ko": "한국어",
		"lv": "Latviešu",
		"lt": "Lietuvių",
		"mk": "Македонски",
		"ms": "Bahasa Melayu",
		"mr": "मराठी",
		"mi": "Māori",
		"ne": "नेपाली",
		"no": "Norsk",
		"fa": "فارسی",
		"pl": "Polski",
		"pt": "Português",
		"ro": "Română",
		"ru": "Русский",
		"sr": "Српски",
		"sk": "Slovenčina",
		"sl": "Slovenščina",
		"es": "Español",
		"sw": "Kiswahili",
		"sv": "Svenska",
		"tl": "Tagalog",
		"ta": "தமிழ்",
		"th": "ไทย",
		"tr": "Türkçe",
		"uk": "Українська",
		"ur": "اردو",
		"vi": "Tiếng Việt",
		"cy": "Cymraeg"
	}

	
	  if((props.data!==undefined || props.data!==null) && contentSummaries.length==0){
		contentSummaries = props.data.summaries

		
		if(contentSummaries!==undefined){
			
			contentSummaries.map(summary => summary.summary!==null && languages.push(summary.lang));
			
			
			summary = contentSummaries.find(summary => summary.lang ===   language);
			if(summary!==undefined && summary.length>0 && summary.summary===null){
				setTranslationMessage(true)
				languagesWanted.push(language)
			}
			

			
		}

	}

	const reorderedLanguageCodes = {
		...languages.reduce(
		  (result, code) => {
			if (language_codes.hasOwnProperty(code)) {
			  result[code] = language_codes[code];
			  delete language_codes[code];
			}
			return result;
		  },
		  {}
		),
		...language_codes
	  };

	
	const handleLanguageChange = (event) => {
	/* 	if(errorMessage ==true || translationMessage==true)
		{
			window.location.reload();
		} */
		const selectedCode = event.target.value;
    setLanguage(selectedCode);

	
	  };
	

	const requestTranslation = async () => {

		await currentUser.getIdToken().then((idToken) => {
	
			axios.post(
							`${process.env.REACT_APP_API_URL}/sources/${data.source_type}/${data.source_id}?lang=${language}`,
							{
								lang: language,
							},
							{
							headers: {
								'id-token': idToken,
							},
						}
				
						)
						.then((response) => {
							setLanguagesWanted([...languagesWanted, language])
							setTranslationMessage(true)
							setTranslatingLanguage(language)
					
						})
						.catch((error) => {							
							
							setErrorMessage(true)
						}
						);

		})
	}






	const checkScrollPosition = () => {
		const windowHeight = ref.current.clientHeight;

		const scrollPosition = ref.current.scrollTop;

		if (scrollPosition >= 3 * windowHeight) {
			setShowButton(true);
		} else {
			setShowButton(false);
		}
	};


	const themePopover = {
	popover: {
	  styles: {
		base: {
		  bg: "bg-white dark:bg-mildDarkMode",
		  color: "text-blue-gray-500 dark:text-zinc-200",
		  border:"border-0",
		  
		},
	  },
	},
  };


 

	useEffect(() => {

		setTimeout(() => {
			setBasicDataLoaded(true);
		}
			, 1000);
		setTimeout(() => {
			
		} , 1000);
		
		if(transcript.length===0 && data.transcript!==null){
			transcriptParser();
		}
		const scrollableDiv = ref.current;
		scrollableDiv.addEventListener("scroll", checkScrollPosition);

		return () => {
			scrollableDiv.removeEventListener("scroll", checkScrollPosition);
		};



	}, []);

	// for question answering
	const timestampChanger = (event) => {
		setAutoplay(1);
		let formattedTimestamp = event.target.textContent;
		const [hours, minutes, seconds] = formattedTimestamp.split(':');
		setTimestamp(hours * 3600 + minutes * 60 + seconds.substring(0, 2) * 1)

		/* 
				setTimestamp(hours[0] === "0" ? hours[1] * 3600 : hours * 3600
		
					+ minutes[0] === "0" ? minutes[1] * 60 : minutes * 60
		
						+ seconds[0] === "0" ? seconds[1] * 1 : seconds.substring(0, 2) * 1) */

	}
	const handleClickTimestamp = (event) => {
		setAutoplay(1);
		let formattedTimestamp = event.target.textContent;
		const [hours, minutes, seconds] = formattedTimestamp.split(':');

		setTimestamp(hours * 3600 + minutes * 60 + seconds * 1);
	};

	

	async function transcriptParser() {
		

		if (summary !== undefined || summary !== null) {
			summaryArray = summary.summary.split('\n');
			

			var parser = new srtParser2();

			var srt_array = parser.fromSrt(transcript_raw);



			let nothing = '';
			let count = 0;

			transcript.push('00:00:00');
			


			for (let i = 0; i < srt_array.length; i++) {
				count = count + 1;
				nothing = nothing + ' ' + srt_array[i].text;
				if (
					(count > 6 || count >= srt_array.length) &&
					srt_array[i].text.substring(srt_array[i].text.length - 1, srt_array[i].text.length) === '.'
				) {
					transcript.push(nothing);
					transcript.push(srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4));
					//timestamps = timestamps + `<a style='cursor:pointer' onclick={event.target.textContent} ${srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4)} <a/>`
					count = 0;
					nothing = '';
				}
				// in case missing punctuation, push it anyway
				else if (count > 12) {
					transcript.push(nothing);
					transcript.push(srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4));
					//timestamps = timestamps + `<a style='cursor:pointer' onclick={event.target.textContent} ${srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4)} <a/>`
					count = 0;
					nothing = '';

				}
				else if (i === srt_array.length - 1) {

					transcript.push(nothing);
					count = 0;
					nothing = '';
				}


			}
		}
		else {

			var parser = new srtParser2();

			var srt_array = parser.fromSrt(transcript_raw);


			let nothing = '';
			let count = 0;

			transcript.push('00:00:00');


			for (let i = 0; i < srt_array.length; i++) {
				count = count + 1;
				nothing = nothing + ' ' + srt_array[i].text;
				if (
					(count > 6 || count >= srt_array.length) &&
					srt_array[i].text.substring(srt_array[i].text.length - 1, srt_array[i].text.length) === '.'
				) {
					transcript.push(nothing);
					transcript.push(srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4));
					//timestamps = timestamps + `<a style='cursor:pointer' onclick={event.target.textContent} ${srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4)} <a/>`
					count = 0;
					nothing = '';
				}

				else if (count > 12) {
					transcript.push(nothing);
					transcript.push(srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4));
					//timestamps = timestamps + `<a style='cursor:pointer' onclick={event.target.textContent} ${srt_array[i].endTime.substring(0, srt_array[i].endTime.length - 4)} <a/>`
					count = 0;
					nothing = '';

				}
				else if (i === srt_array.length - 1) {
					transcript.push(nothing);
				}


			}

		}
		/* transcript_array = data.transcript_chunked.split("\n") */



	}


	const handleDownload = (selection) => {
		
		
		setDownloading(true)
		// popover.toggle()
		
		
		// create .srt file
		setTimeout(() => {


			if (activeTab === "tab2") {
				if (selection==1){
				const blob = new Blob([data.transcript], { type: 'text/srt' });

				// save file as blob
				saveAs(blob, `${data.creator_name}_${data.title}_Subtitles.srt`);
			
			}
			else if(selection==2){
				let text = ""
				let stop = false
				for (let i = 0; i < transcript.length; i++){
					text = text + transcript[i] + '\n\n'
					if(i===transcript.length-1){
						stop = true
					}
					
				}
				if (stop === true){
				const blob = new Blob([text], { type: 'text/txt' });
				saveAs(blob, `${data.creator_name}_${data.title}_Transcript.txt`);
				
				}
			}

				setTimeout(() => {
					setDownloading(false)
				}, 2000)
			}

		}, 3000)


	};

	transcriptParser();
	
	

	return (
		<div ref={ref} className={`md:max-w-[90vw] scroll-smooth pb-10 lg:px-10 xl:px-20 3xl:px-40  mt-5 md:mt-0 grow mx-auto overflow-x-hidden`}>

 


		<div>
				<div className="grid grid-cols-3 max-h-[90vh]">
					<div className="col-span-2 ">
						<div className="flex flex-row ">
						<h1 className="col-span-2 mt-10 3xl:pt-8 text-xl text-left lg:col-span-3 lg:mt-0 lg:text-2xl text-blueLike dark:bg-darkMode dark:text-zinc-300 font-bold">
							{data.title}
						</h1>
							
<div className="flex flex-row justify-end mx-auto">
	<div className="hidden 3xl:block flex  2xl:ml-40 justify-end ">
	
			<select onChange={handleLanguageChange} id="small" class="block w-[200px] p-2.5 mt-10  text-sm text-zinc-700 border border-blue-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-mildDarkMode dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					{Object.entries(reorderedLanguageCodes).map(([code, name],index) => (
						
						(language === code ? 
							<option selected key={code} value={code}>
								{name}
							</option>
							:


							(index===languages.length 
								?
								<option className="text-gray-500 dark:text-gray-300"disabled>--Request Translation--</option>
								:
						<option className={`${languages.includes(code) ?  "" : "text-gray-300 dark:text-gray-500"}`}  key={code} value={code}>
								{name}
							</option>	

							)
							
						)
										
								))}
					</select>
				
					
				</div>

					</div>
					</div>
						<h2 className="col-span-2 mt-5 text-l text-left lg:col-span-3 lg:mt-5 lg:text-xl text-blueLike dark:bg-darkMode dark:text-zinc-300 font-light">
							{data.creator_name}
						</h2>
						<p className="w-full mt-5 border border-zinc-100 dark:border-zinc-700"></p>
					<div className="mt-5 3xl:hidden ">
{/* 					<label for="small" class="block mb-2 text-sm font-light text-gray-500 dark:text-white">Language</label>
 */}					<select  onChange={handleLanguageChange} id="small" class="block w-[200px] p-2.5 mb-6 text-sm text-zinc-700 border border-blue-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-mildDarkMode dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					{Object.entries(reorderedLanguageCodes).map(([code, name],index) => (
						
						(language === code ? 
							<option selected key={code} value={code}>
								{name}
							</option>
							:


							(index===languages.length 
								?
								<option className="text-gray-500 dark:text-gray-300"disabled>--Request Translation--</option>
								:
						<option className={`${languages.includes(code) ?  "" : "text-gray-300 dark:text-gray-500"}`}  key={code} value={code}>
								{name}
							</option>	

							)
							
						)
										
								))}
					</select>
					</div>

					</div>

					<div className="flex flex-col mt-5 ml-2 items-center cursor-pointer lg:hidden ">
						{data.source_type === 'yt' ? (
							<a target="_blank" href={`https://www.youtube.com/watch?v=${data.source_id}`}>
								<img className="ml-1" src="/youtubeicon.png" width={100} />
								<p className="-mt-3  text-center items-center text-sm font-medium">Click to Watch</p>
							</a>
						) : (
							<a className="mt-7" target="_blank" href={`https://twitter.com/i/${data.source_id}`}>
								<img src={Twitter} width={100} />
								<p className="mt-3 text-sm font-medium text-center items-center ">Click to Listen</p>
							</a>
						)}

					</div>
					{data.source_type === 'sp' &&
					<div className="flex hidden flex-col ml-2 items-center  lg:block ">
					<a className="mx-auto flex items-center flex-col cursor-pointer" target="_blank" href={`https://twitter.com/i/${data.source_id}`}>
								<img src={Twitter} width={120} />
								<p className="mt-3 text-sm font-light text-center items-center cursor-pointer">Click to Listen</p>
							</a>
					</div>
}

				</div>

	<div id="content-area">
		{ transcript.length>0 && language == summary.lang
		?
			<div className="flex flex-col xl:flex-row mt-5 lg:mt-16">
				{transcript.length>0 &&

				
					<div className={`grid grid-cols-2 w-full md:min-w-[500px]`}>
						{/* <div className={`hidden lg:flex justify-center items-center ${data.transcript ? "xl:w-1/2 w-2/3 h-[300px]" : "w-full h-[500px]"}  h-inherit mx-auto pb-10 xl:pb-0`}> */}
						
						<div className={`col-span-2 hidden ${data.source_type==="sp"?"":"xl:flex"}  justify-center items-center w-[95%] h-[400px]  h-inherit mx-auto pb-10 xl:pb-0`}>
							{data.source_type === 'sp' ? (
/* 
								<div className={`block ${transcript.length>0 || data.complete===true ? "w-full" : "w-1/3"} items-center text-center mx-auto`}>
						
									<a target="_blank"
										href={`https://twitter.com/i/spaces/${data.source_id}`}
										className="text-l text-zinc-600 text-center dark:text-zinc-200 pt-2 cursor-pointer"
									>
										<img src={Twitter} width={100} />
										Listen to "{data.title}"{' '}
									</a>
								</div> */
								null
							) : (
								transcript.length>0 ||data.complete===true ?
								<iframe
									id="player"
									title="My YouTube Video "
									src={`https://www.youtube.com/embed/${data.source_id}?autoplay=${autoplay}&start=${timestamp}`}
									width="100%"
									height="100%"
									frameBorder="0"
									allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
								></iframe>
								:null


							)}

						</div>
						{/* <Loading /> */}
						<div className={`col-span-2 ${data.source_type=="yt" && "md:mt-10"} drop-shadow-sm`}>
							{isLoading ? (null


							) : (
								summary.key_qa && (
									<QuestionAnswering
										source_id={data.source_id}
										source_type={data.source_type}
										key_qa={summary.key_qa}
										data={data}
										transcript={transcript}
										timestampChanger={timestampChanger}
									/>
								)
							)}
						</div>
						
					</div>
					}
					{transcript.length>0 &&
					
					<div className={`${isLoading ? "hidden" : ""} w-full  3xl:w-1/2 mx-auto mt-10 md:mt-0 ${window.innerWidth >1280 && window.innerWidth<1420 ? "": ""}`} >
						{transcript.length>0 ? (
							<div className={` mt-14 xl:mt-0 w-full bg-[#f7g4g1] 3xl:min-w-[500px]  ${window.innerWidth >1280 && window.innerWidth<1420 ? window.innerWidth >1280 && window.innerWidth<1340 ? "ml-2": "ml-6" : "xl:ml-10"} rounded-lg p-5 border border-zinc-100 drop-shadow-sm dark:border-zinc-700`} >

								<div className="text-sm font-medium text-center text-gray-500 dark:text-zinc-300 dark:border-gray-700 ">
									<ul className="flex flex-wrap border-b border-gray-200 xl:w-[400px] w-full mx-auto	">
										<li className={`w-1/3 md:w-4/12 ${activeTab == "tab3" ? "text-blueLike dark:bg-darkMode dark:text-zinc-300 border-b-2 font-normal border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`} >
											<button onClick={() => setActiveTab("tab3")} className={`text-l inline-block p-4 pt-6 rounded-t-lg dark:text-zinc-200 dark:border-blue-500`}>Key Takeaways</button>
										</li>
										<li className={` w-1/3 md:w-4/12 ${activeTab == "tab1" ? "text-blueLike dark:bg-darkMode dark:text-zinc-300 border-b-2 font-normal border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`} >
											<button onClick={() => setActiveTab("tab1")} className={`text-l inline-block p-4 pt-6 rounded-t-lg dark:text-zinc-200 dark:border-blue-500`}>Summary</button>
										</li>
										<li className={` w-1/3 md:w-4/12 ${activeTab == "tab2" ? "text-blueLike dark:bg-darkMode dark:text-zinc-300 border-b-2 font-normal border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`} >
											<button onClick={() => setActiveTab("tab2")} className={`text-l inline-block p-4 pt-6 rounded-t-lg dark:text-zinc-200 dark:border-blue-500`}>Transcript</button>
										</li>
										{/* 										<li className={` w-1/3 md:w-3/12 ${activeTab == "tab4" ? "text-blueLike dark:bg-darkMode dark:text-zinc-300 border-b-2 font-semibold border-blue-600" : "hover:text-gray-600 hover:border-gray-300"}`} >
											<button onClick={() => setActiveTab("tab4")} className={`text-l inline-block p-4 rounded-t-lg  dark:text-zinc-200 dark:border-blue-500`}>Ask questions</button>
										</li> */}

									</ul>
								</div>
								
								<div className="main-content mt-2 text-zinc-600 dark:text-zinc-200">

									<Tabs>
										<Tab eventKey="transcript" title="">
											
											{activeTab === "tab3" && (data ? summary.key_takeaways ? summary.key_takeaways.map((item, index) => {
												return (

													<p className="pb-2">{index + 1}) {item}</p>)
											}) : null : null)}
											

											{activeTab === 'tab1' && (
												
												<div className="content-area text-l font-normal mb-4 max-w-screen-md overflow-auto max-h-[80vh]">
													{/* <button className="flex ml-auto justify-end flex-row justify-end mb-2 mr-8 opacity-60 font-semibold text-black" onClick={handleDownload}><p className="pr-2">Download</p> {downloading ? <img src={Download}></img> : <img title="Download summary" src={DownloadStatic}></img>}</button> */}


													{isLoading ? (
														<Loading />
													) : summaryArray.length === 0 ? (
														<tr className="border-b-0">
															<td>Still waiting for the summary! Meanwhile, check the transcript.</td>
														</tr>
													) : (
														summaryArray.map((item, index) => {
															return (
																<div className="mb-4 text-zinc-700 dark:text-zinc-200" key={index}>
																	<div className="summary-text">
																	<ReactMarkdown>
																		{item}
																	</ReactMarkdown>
																	</div>

																	


																</div>
															);
														})
													)}
												</div>
											)}
											{activeTab === 'tab2' && (
												<div className="content-area text-l font-normal max-w-screen-md overflow-auto max-h-[80vh] ">

													{isLoading ? (
														<Loading />
													) : (
														transcript.map((item, index) => {
														

															if (index % 2 === 0 && index < transcript.length) {
																return (
																	window.innerWidth > 999 && data.source_type === "yt" ?
																		<div className="flex flex-row dark:text-zinc-300">
																			<a
																				onClick={handleClickTimestamp}
																				className={`${data.source_type === 'yt'
																					? 'lg:cursor-pointer lg:pointer-events-auto'
																					: ''
																					} lg:pointer-events-auto lg:text-slate-900 lg:font-bold underline dark:text-zinc-300`}
																				key={index}
																			>
																				<br></br>


																				<p className="text-md ">{item}{' '}</p>

																			</a>
																		
																		
																			
																			<div className={`${index !==0  ? "hidden" : ""}   flex ml-auto justify-end flex-row justify-end`} >
																			<Popover
																			>
																			
		
																				
																				<PopoverHandler>
																				<button id="popoverButtonDownload" data-popover-target = "popoverHover" data-popover-trigger="hover" className={`${props.hasActiveSub === false || props.hasActiveSub ==undefined ? "cursor-default dark:invert":""} mr-8 opacity-80 pt-4`} > <img className={`${props.hasActiveSub === false || props.hasActiveSub ==undefined ? " opacity-30":""} dark:invert`} src={DownloadStatic}></img></button>
																				</PopoverHandler>
																				
																		<div data-popover id="popoverHover" role="tooltip" className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-zinc-200 dark:border-gray-600 dark:bg-mildDarkMode ">
																			<ThemeProvider value={themePopover}>
																		<PopoverContent background="indigo">
																		{props.hasActiveSub ==true && basicDataLoaded==true ?
																		
																					<div>
 																				<div onClick={() => handleDownload(1)} className="px-3 cursor-pointer py-2 hover:bg-zinc-100  dark:hover:bg-zinc-200 dark:hover:text-zinc-500">
																						<p className="">Download as Plain Subtitles (.srt)</p>
																					</div>
																					
																					<div onClick={() => handleDownload(2)} className="px-3 cursor-pointer py-2 hover:bg-zinc-100  dark:hover:bg-zinc-200 dark:hover:text-zinc-500">
																					<p>Download Formatted Transcript (.txt)</p>	
																					</div>
																					</div>
																					: 
																					
																					<div  className="px-3 cursor-pointer py-2 pointer-events-none ">
																						<p className="">Go premium to download the transcript</p>
																					</div>}
																					</PopoverContent>
																					</ThemeProvider>
																					
																	</div>
																	</Popover>
																	
																	</div>
																		

																		</div> 
																		
																		:
																		<div className="flex flex-row">
																			<a

																				target="_blank" href={data.source_type === "yt" ? `https://youtu.be/${data.source_id}?t=${Math.floor(parseInt(item.split(':')[0] * 3600) + parseInt(item.split(':')[1] * 60) + parseInt(item.split(':')[2]))}` : `https://twitter.com/i/spaces/${data.source_id}`}
																				
																						
																				className={`${data.source_type === 'yt'
																					? 'lg:cursor-pointer lg:pointer-events-auto'
																					: ''
																					}  lg:pointer-events-auto lg:text-slate-900 dark:text-zinc-300 font-bold underline`}
																				key={index}
																			>
																				<br></br>

																				{item}{' '}
																				

																			</a>
																			
																			<div className={`${index !==0  ? "hidden" : ""}   flex ml-auto justify-end flex-row justify-end`} >
																			<Popover
																			>
																			
		
																				
																				<PopoverHandler>
																				<button id="popoverButtonDownload" data-popover-target = "popoverHover" data-popover-trigger="hover" className={`${props.hasActiveSub === false || props.hasActiveSub ==undefined ? "cursor-default dark:invert":""} mr-8 opacity-80 pt-4`} > <img className={`${props.hasActiveSub === false || props.hasActiveSub ==undefined ? " opacity-30":""} dark:invert`} src={DownloadStatic}></img></button>
																				</PopoverHandler>
																				
																		<div data-popover id="popoverHover" role="tooltip" className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-zinc-200 dark:border-gray-600 dark:bg-mildDarkMode ">
																			<ThemeProvider value={themePopover}>
																		<PopoverContent background="indigo">
																		{props.hasActiveSub ==true && basicDataLoaded==true ?
																		
																					<div>
 																				<div onClick={() => handleDownload(1)} className="px-3 cursor-pointer py-2 hover:bg-zinc-100  dark:hover:bg-zinc-200 dark:hover:text-zinc-500">
																						<p className="">Download as Plain Subtitles (.srt)</p>
																					</div>
																					
																					<div onClick={() => handleDownload(2)} className="px-3 cursor-pointer py-2 hover:bg-zinc-100  dark:hover:bg-zinc-200 dark:hover:text-zinc-500">
																					<p>Download Formatted Transcript (.txt)</p>	
																					</div>
																					</div>
																					: 
																					
																					<div  className="px-3 cursor-pointer py-2 pointer-events-none ">
																						<p className="">Go premium to download the transcript</p>
																					</div>}
																					</PopoverContent>
																					</ThemeProvider>
																					
																	</div>
																	</Popover>
																	
																	</div>
																{/* 			{index === 0 && <button className="flex ml-auto justify-end flex-row justify-end  mr-4 opacity-80 pt-4" onClick={handleDownload}>{downloading ? <img src={Download}></img> : <img title="Download transcript" src={DownloadStatic}></img>}</button>} */}
																		</div>

																);
															} else if (index % 2 === 1 && index < transcript.length) {
																return (
																	<div key={index}>
																		<br></br>
																		{item}
																	</div>
																);
															}
														})
													)}
												</div>
											)}
										</Tab>
									</Tabs>
								</div>
							</div>
						) : (
							<div>
								
							</div>
						)}
					</div>}{' '}
				</div>
:

<div className="flex flex-col mb-20 mt-20 ">
	{errorMessage ==true || (languagesWanted.includes(language)===true) || languages.includes(language) || (summary.summary!==undefined && summary.summary.length>0) || language=="en" ? null :
								<p className="text-xl text-zinc-500 dark:text-zinc-200 font-light max-w-screen-md mx-auto p-3 text-center">

									Seems like Alphy hasn't processed the content in {language_codes[language]} yet. {props.hasActiveSub ==true ? <p>Request Alphy to generate summary, key takeaways, and questions in {language_codes[language]} clicking <a onClick={requestTranslation} className="underline text-green-400 cursor-pointer">here</a>.</p> 
									:<p>Go premium to request translation. You can check out the <a className="underline text-green-300" href={currentUser ? "/account" :"/plans"}>{currentUser ? "Account" : "Plans"} </a> page for more detail</p>}
									 
								{/* 	<div className="ml-4 mt-12">
						<button type="button" class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Request Summary</button>
					</div> */}
								</p>
}

				</div>
	
	}		
		</div>

			</div>

{basicDataLoaded && <div>
			{transcript.length==0 && language==="en"?

				<div className="flex flex-col mb-20 mt-20 ">
								<p className="text-xl text-zinc-500 dark:text-zinc-200 font-light max-w-screen-md mx-auto p-3 text-center">
								
									Alphy is doing its best to process this video, it will be ready in a few minutes. If you have time please consider supporting us by giving an upvote on <a className="text-green-300 underline" href="https://www.producthunt.com/posts/alphy?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-alphy" target="_blank"> Producthunt</a>!
									 
									 <img className={`opacity-70 dark:opacity-90 mx-auto `} src={working} alt="My SVG" /> 
									 
									 
								</p>

				</div>: null
							}
					{((summary!=undefined && summary!==null && summary.summary==null && summary.lang!=="en" ) || languagesWanted.includes(language)==true) && <div className="flex flex-col mb-20 mt-20 ">
					<p className="text-xl text-zinc-500 dark:text-zinc-200 font-light max-w-screen-md mx-auto p-3 text-center">

						Alphy is currently working hard to translate this video to {language_codes[language]}. Please come back in a few minutes!
						
						<img className={`opacity-70 dark:opacity-90 mx-auto `} src={working} alt="My SVG" /> 
						
					</p>

					</div>}
					</div>}
{errorMessage ==true && <div className="flex flex-col mb-20 mt-20 ">
<p className="text-xl text-zinc-500 dark:text-zinc-200 font-light max-w-screen-md mx-auto p-3 text-center">

	There was an error with the request :( <br></br><br></br>Please refresh the page and try again. If the issue persists, please contact us at support@alphy.app
	 
	
	 
</p>

</div>}
				

		</div>
	);
}
