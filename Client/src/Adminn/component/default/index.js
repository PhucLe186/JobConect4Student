import Header from '~/Adminn/component/mainlayout/Header';
import Footer from '~/Adminn/component/mainlayout/Footer';

function Default({ children }) {
    return (
        <div>
            <Header></Header>
            <div>{children}</div>
            <Footer></Footer>
        </div>
    );
}

export default Default;
