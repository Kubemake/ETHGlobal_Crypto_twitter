import {useEffect, useState} from 'react';
import {getLastTweets} from '../../adapters/api';
import config from '../../../config';
import Pagination from '@material-ui/lab/Pagination';
import avatar from './../../../public/images/user-avatar.svg';
import moment from 'moment';
import matchAll from 'match-all';

export function Tweeter() {

  const [tweets, setTweets] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const setList = async (page) => {
    const tw = await getLastTweets(config.tweetsPerPage, (page - 1) * config.tweetsPerPage);
    console.log('list', tw);
    setTweets(tw.list);
    setPage(page);
    setPages(tw.pages);
  };

  const handleChange = (event, value) => {
    setList(value);
  };

  const maskAddress = address => {
    let maskedAddress = address.substring(0, 15);
    maskedAddress += '...';
    maskedAddress += address.substring(address.length - 15);
    return maskedAddress;
  };

  useEffect(() => {
    setList(page);
  }, [page]);

  const makeDate = timestamp => {
    return moment(timestamp * 1000).format('DD MMM YYYY HH:mm');
  };

  const parseTweet = (text) => {
    const regs = matchAll(text, /(([^\s]+)\.(jpg|jpeg|png|gif|webp|ico))/gi);
    const urls = regs.toArray();
    const replaces = urls.map(img => '<img src="' + img + '" alt="" class="thumb"/>');
    for (let i in urls) {
      text = text.replace(urls[i], replaces[i]);
    }
    return text;
  };

  console.log('tweets', tweets);
  return (
      <div className="App-tweeter">
        <h3>latest tweets</h3>
        <ul className="list-tweets">
          {tweets && tweets.map((tweet, key) =>
              <li key={key}>
                <div className="message-avatar">
                  <img src={avatar} alt="avatar"/>
                </div>

                <div className="message-content">
                  <div className="message-from">
                                <span>
                                     From {
                                  tweet.owner_name.length ?
                                      <>
                                        <strong>@{tweet.owner_name}</strong>
                                        &nbsp;({maskAddress(tweet.owner_address)})
                                      </> :
                                      <>{tweet.owner_address}</>
                                }
                                </span>
                  </div>

                  <div className="message-time">
                    {makeDate(tweet.created_at)}
                  </div>

                  <div className="message-text"  dangerouslySetInnerHTML={{__html: parseTweet(tweet.tweet)}}></div>
                </div>
              </li>
          )}
        </ul>

        <Pagination count={pages} page={page} onChange={handleChange}/>
      </div>
  );
}