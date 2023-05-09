import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../../../hooks/useWindowSize';
import './FeedItem.css';
import Twitter from '../../../img/twitter_spaces.png';

const FeedItem = ({ item, setCollapsed, mainInputFeed }) => {
	const source_id = item.source_id;

	let imageUrl;
	if (item.source_type === 'yt') {
		imageUrl = `https://i.ytimg.com/vi/${source_id}/hqdefault.jpg`;
	} else if (item.source_type === 'sp') {
		imageUrl = Twitter;
	}



	
	const navigate = useNavigate();

	return (
		<div className={'grid border-b-0'}>
			<a href={`/${item.source_type === 'sp' ? 'sp' : 'yt'}/${item.source_id}`} >
			<div className="flex w-full">
				<div
					className={`flex ${' '} ${'pointer-events-none'}flex-row items-center justify-start cursor-pointer w-full h-full hover:bg-slate-100  p-2 rounded-md mb-2 transition duration-200 ease-in-out hover:shadow-md  sm:hover:scale-105 transform sm:hover:translate-x-2 sm:hover:translate-y-2 mr-auto ml-auto`}
					onClick={() => {
						

						// navigate(`/${item.source_type === 'sp' ? 'sp' : 'yt'}/${item.source_id}`);
						
					setCollapsed(true)
					}}
					target="_blank"
				>
					<div className="w-1/2 min-w-[100px] max-w-[300px] mr-3">
						<div
							className="flex items-center justify-center h-0 rounded-md bg-gray-600"
							style={{
								backgroundImage: `url(${imageUrl})`,
								paddingBottom: '50%',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								backgroundSize: 'cover',
							}}
						></div>
					</div>

					<div className="text-xs w-1/2">
						{item.is_complete ? null : (
							<div className="side-feed-creator font-bold text-purpleLike"> 📝 IN PROGRESS</div>
						)}
						<div className="text-sm video-text text-bordoLike font-semibold">{item.title}</div>
						<div className="side-feed-creator font-italic text-purpleLike">{item.creator_name}</div>

						{/* <div className="side-feed-date">{moment(item.source_ts).format('DD:MM:YYYY')}</div> */}
					</div>
				</div>
			</div>
			</a>
		</div>
	);
};
export default FeedItem;
