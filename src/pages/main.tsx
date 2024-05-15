import { Button } from "../components/ui/button";
import { IcKakaoIcon } from "../components/icons/IcKakao";
import { Layout } from "../components/Layout";


const Main = () => {
    return (
        <Layout>
        <nav className={'w-[100vw]'} style={{ 
        display: 'flex', justifyContent: 'space-between',
        position: 'sticky', top: 0  }}>
      <img src="logo.png" alt="logo" />
        <div style={{ display: 'flex' }}>
          <img src="icon1.png" alt="icon1" />
          <img src="icon2.png" alt="icon2" />
          <img src="icon3.png" alt="icon3" />
        </div>
        
      </nav>

    <div className={'w-[100vw]'}>
      {/* Navigation Bar */}
      
      {/* Description Area */}
      <div style={{ marginTop: '200px' }}>
        <p>Line 1 of the phrase</p>
        <p>Line 2 of the phrase</p>
        <p>Line 3 of the phrase</p>
      </div>

      {/* Menu */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Menu Item 1</p>
          <button>></button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p>Menu Item 2</p>
          <button>></button>
        </div>
      </div>
    </div>
  );
        </Layout>)
}


export default Main;