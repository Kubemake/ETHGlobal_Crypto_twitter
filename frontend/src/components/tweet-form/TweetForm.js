import {useState, useEffect} from "react";
import {getContract} from "../../adapters/eth";
import config from '../../../config';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountBox from '@material-ui/icons/AccountBox';
import ChatIcon from '@material-ui/icons/Chat';
import SendIcon from '@material-ui/icons/Send';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import GetAppIcon from '@material-ui/icons/GetApp';

export default function TweetForm() {
    const [contract, setContract] = useState(false);
    const [ownerName, setOwnerName] = useState('');

    useEffect(() => {
        const initiate = async () => {
            try {
                const contract = await getContract();
                const name = await contract.msgContract.methods.name(contract.currentAccount).call()
                setContract(contract);
                setOwnerName(name);
            } catch (msg) {
                if (msg === 'not-installed') {
                    setIsMetaMaskEnabled(false);
                }
            }
        }
        initiate();
    }, []);

    useEffect(() => {
        setIsMetaMaskEnabled(typeof contract.msgContract !== "undefined");
    }, [contract])

    const [isMetaMaskEnabled, setIsMetaMaskEnabled] = useState(true);
    const [tweetContent, setTweetContent] = useState();
    const [noClick, setNoClick] = useState(false);
    const [submitText, setSubmitText] = useState('Send crypto tweet');
    const [metaMaskText, setMetaMaskText] = useState('Get MetaMask to be able publish posts');
    const [submitName, setSubmitName] = useState('Set name to address');
    const [ownerNameError, setOwnerNameError] = useState('');
    const [tweetContentError, setTweetContentError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    let [isShowForm, setIsShowForm] = useState(true);

    const handleOwnerName = (event) => {
        const name = event.target.value;
        if (name.length > config.maxOwnerNameLength) {
            setOwnerNameError('Max name length is ' + config.maxOwnerNameLength);
            return false;
        }
        setOwnerNameError('');
        setOwnerName(name);
        return true;
    };

    const handleTweetContent = (event) => {
        const content = event.target.value;
        if (content.length > config.maxTweetContentLength) {
            setTweetContentError('Max content length is ' + config.maxTweetContentLength);
            return false;
        }
        setTweetContentError('');
        setTweetContent(content);
        return true;
    };

    const updateOwnerName = async (event) => {
        event.preventDefault();
        if (typeof contract.msgContract === "undefined") {
            setIsMetaMaskEnabled(false);
            setNoClick(true);
            setMetaMaskText("Please unlock MetaMask to make post");
            return false;
        }

        setSubmitName('Processing... please wait!');
        setSubmitText('Processing... please wait!');
        setIsProcessing(true);
        try {
            await contract.msgContract.methods.setName(ownerName).send({from: contract.currentAccount})
                .once('receipt', (receipt) => {
                    setSubmitName('Set name to address');
                    setOwnerName(ownerName);
                    setIsProcessing(false);
                })
                .on('error', error => {
                    console.error('Error on setName', error);
                })
        } catch (error) {
            console.error(error);
        }
    };

    const sendTweet = async (event) => {
        event.preventDefault();
        if (typeof contract.msgContract === "undefined") {
            setIsMetaMaskEnabled(false);
            setNoClick(true);
            setMetaMaskText("Please unlock MetaMask to make post");
            return false;
        }

        setSubmitText('Processing... please wait!');
        setSubmitName('Processing... please wait!');
        setIsProcessing(true);
        try {
            await contract.msgContract.methods.write(tweetContent).send({from: contract.currentAccount})
                .once('receipt', (receipt) => {
                    setSubmitText('Send crypto tweet');
                    setTweetContent('');
                    setIsProcessing(false);
                    window.location.reload();
                })
                .on('error', error => {
                    console.error('Error on write', error);
                })
        } catch (error) {
            console.error(error);
        }
    };

    const getMetaMask = () => {
        if (noClick || isProcessing) return false;
        console.log("getMetaMask pressed");
        window.open("https://metamask.io/download.html", "_blank");
    };

    const changeFormStatus = () => {
        setIsShowForm(!isShowForm);
    };

    return (
        <div className="App-form">
            <header>
                <h3>Place your new tweet</h3>
                
                  <p onClick={changeFormStatus}>
                      {isShowForm && <span>hide </span>}
                      {!isShowForm && <span>show </span>}
                      form
                </p>

            </header>

            <div  className={`form-container ${!isShowForm ? "form-hide" : "form-show"}`} >
                <form onSubmit={updateOwnerName}>
                    <TextField
                        id="outlined-full-width"
                        label="Connect Name with Address"
                        placeholder="Enter name to connect it with address"
                        margin="normal"
                        value={ownerName}
                        onChange={handleOwnerName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountBox/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="outlined" color="primary" size="large" type={'submit'} endIcon={<DynamicFeedIcon/>}
                            disabled={!isMetaMaskEnabled || isProcessing}>
                        {submitName}
                    </Button>

                    <div className={'form-error'}>{ownerNameError}</div>
                </form>


                <br/>
                <h3>Your tweet content</h3>
                <form onSubmit={sendTweet} className="form-vertical">
                    <TextField
                        id="outlined-full-width"
                        label="Your Message"
                        placeholder="Enter message you want to publish"
                        margin="normal"
                        value={tweetContent}
                        onChange={handleTweetContent}
                        multiline
                        rows={2}
                        rowsMax={5}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <ChatIcon/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className={'form-error'}>{tweetContentError}</div>

                    {isMetaMaskEnabled &&
                    <Button variant="contained" color="primary" size="large" type={'submit'} endIcon={<SendIcon/>}
                            disabled={isProcessing}>
                        {submitText}
                    </Button>
                    }

                    {(!isMetaMaskEnabled && !isProcessing) &&
                    <Button variant="contained" color="secondary" size="large" type="button" endIcon={<GetAppIcon/>}
                            onClick={getMetaMask}>
                        {metaMaskText}
                    </Button>
                    }

                </form>
            </div>

        </div>
    )
}