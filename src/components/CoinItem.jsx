import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link } from "react-router-dom"


function CoinItem({ coin }) {

    /*     const [savedCoin, setSavedCoin] = useState(false)
        const { user } = UserAuth()
    
        const handleSavedCoin = () => {
            setSavedCoin(prevCoin => !prevCoin)
        }
    
        const coinPath = doc(db, "user", `${user?.email}`)
        const saveCoin = async () => {
            if (user?.email) {
                handleSavedCoin()
                await updateDoc(coinPath, {
                    favorites: arrayUnion({
                        id: coin.id,
                        name: coin.name,
                        image: coin.image,
                        rank: coin.market_cap_rank,
                        symbol: coin.symbol,
                        price: coin.current_price,
                    })
                })
            } else {
                alert("Please sign in.")
            }
        } */

    return (
        <tr className='h-[75px] border-b overflow-hidden'>
            <td>{coin.market_cap_rank}</td>
            <td>
                <div className='flex items-center'>
                    <img className='w-6 ml-2 coin-img' src={coin.image} alt={coin.id} />
                    <div className='w-[90px] hidden sm:table-cell'>{coin.name}</div>
                </div>
            </td>
            <td>
                <div><Link to={`/article/${coin.id}`}>{coin.symbol.toUpperCase()}</Link></div>
            </td>
            <td>${coin.current_price.toLocaleString()}</td>
            <td className={coin.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-600"}>{coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td className='w-[200px] hidden md:table-cell'>${coin.total_volume.toLocaleString()}</td>
            <td className='w-[200px] hidden md:table-cell' >${coin.market_cap.toLocaleString()}</td>
            <td>
                <Sparklines svgWidth={140} svgHeight={40} data={coin.sparkline_in_7d.price}>
                    <SparklinesLine color="lightblue" />
                </Sparklines>
            </td>
        </tr>
    )
}

export default CoinItem