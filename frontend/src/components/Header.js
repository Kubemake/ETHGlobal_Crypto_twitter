import logo from './../../public/logo.svg'
import logoAnimated from './../../public/ethereum-eth-logo-animated.gif'

export function Header() {
    return (
        <header className="App-header">
            <div  onClick={() => window.scrollTo(0, 0)}>
                <img src={logoAnimated} alt="" />
                <h2>Crypto Twitter</h2>
            </div>

            <img src={logo} alt="" />
        </header>
    );
}

