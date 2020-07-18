class Part extends React.Component {
    render() {
        return (
            <div>
                <h3>{this.props.title}: {this.props.data.slug}</h3>
                <p>{this.props.data.recipe}</p>
            </div>
        )
    }
}

class AllParts extends React.Component {
    render() {
        return (
            <div>
                <h2>Random Taco</h2>
                <Part title="Shell" data={this.props.data.shell} />
                <Part title="Mixin" data={this.props.data.mixin} />
                <Part title="Seasoning" data={this.props.data.seasoning} />
                <Part title="Base layer" data={this.props.data.base_layer} />
                <Part title="Condiment" data={this.props.data.condiment} />
            </div>
        )
    }
}
class Content extends React.Component {
    render() {
        return (
            <div>
                <FormFindTaco searchTaco={this.props.searchTaco} handleChange={this.props.handleChange} />
                <button onClick={this.props.fetchData} className='fresh'>Fresh Taco</button>
                {this.props.data ? <AllParts data={this.props.data} /> : ''}

                {this.props.specificTaco ?
                    <Part title={this.props.recipe_type} data={this.props.specificTaco} /> : ''
                }
            </div>
        )
    }
}

class FormFindTaco extends React.Component {
    render() {
        return (
            <React.Fragment>
                <form>
                    <div className="form-group">
                        <input type="text" className="form-control" id="recipe_slug" placeholder="enter recipe_slug" onChange={this.props.handleChange} required />
                    </div>
                    <Button className="btn btn-primary" id="shells" name="Shell" searchTaco={this.props.searchTaco} />
                    <Button className="btn btn-info" id='mixins' name="Mix-in" searchTaco={this.props.searchTaco} />
                    <Button className="btn btn-warning" id='base_layers' name='Base-layer' searchTaco={this.props.searchTaco} />
                    <Button className="btn btn-success" id='seasonings' name='Seasoning' searchTaco={this.props.searchTaco} />
                    <Button className="btn btn-dark" id='condiments' name='Condiment' searchTaco={this.props.searchTaco} />
                </form>
            </React.Fragment>
        )
    }
}

class Button extends React.Component {
    render() {
        return (
            <button type="submit" className={this.props.className} id={this.props.id} onClick={this.props.searchTaco}>{this.props.name}</button>
        )
    }
}
class App extends React.Component {
    constructor(props) {
        super(props),
            this.state = {
                baseUrl: 'http://taco-randomizer.herokuapp.com/',
                url: 'http://taco-randomizer.herokuapp.com/random/?full-tack=true',
                recipe_slug: '',
                recipe_type: '',
                searchUrl: '',
                specificTaco: ''
            }
    }
    // call API
    fetchData = async () => {
        const response = await fetch(this.state.url);
        const data = await response.json();
        this.setState({
            data: data
        })
    }

    // handle Change
    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value })
    }

    // search specific Taco
    searchTaco = (event) => {
        event.preventDefault()
        const id = event.target.id;
        const arr = id.split('');
        arr.pop();
        this.setState({
            recipe_type: arr.join(''),
            searchUrl: this.state.baseUrl + id + '/' + this.state.recipe_slug + '/'
        }, async () => {
            try {
                const response = await fetch(this.state.searchUrl);
                const data = await response.json();
                this.setState({
                    data: null,
                    specificTaco: data
                })

            } catch (err) {
                console.log(err);
            }
        })
    }

    // fetch data right page load
    componentDidMount() {
        this.fetchData()
    }

    render() {
        return (
            <Content fetchData={this.fetchData} data={this.state.data} searchTaco={this.searchTaco} handleChange={this.handleChange} recipe_type={this.state.recipe_type} specificTaco={this.state.specificTaco} />
        )
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('.container')
)