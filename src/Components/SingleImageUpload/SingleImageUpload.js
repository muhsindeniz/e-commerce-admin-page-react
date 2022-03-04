import React, { useState, useEffect } from 'react';
import { Upload,Button,Progress} from 'antd';
import { PlusOutlined,LoadingOutlined,DeleteOutlined,EyeOutlined} from '@ant-design/icons';
import axios from 'axios';

export default (props) => {
	let { record, setRecord, name } = props;
	let [file, setFile] = useState([]);
	let [imageUrl, setImageUrl] = useState(false);
	let [loading, setLoading] = useState(false)
	let [uploadStart, setUploadStart] = useState(false)
	const [progress, setProgress] = useState(0);
	
	useEffect(() => {
		if(record[name]) {
			setImageUrl(record[name]);
		}
	}, []);

	let handleChange = info => {
		if(!info.event && uploadStart === false) {
			setUploadStart(true)
			const formData = new FormData();
			formData.append('files_0', info.file.originFileObj)
			axios.post("http://localhost:3000/api/addVegetables", formData, { headers: { 'ContenType': 'multipart/form-data'} }).then(({ data: { result, result_message } }) => {
				setTimeout(() => setProgress(100), 1000);
				setTimeout(() => setProgress(0), 2000);
				if (result_message.type === 'success') {
					setFile(result[0]);
					setImageUrl(result[0].url);
					setRecord({...record, [name]:result[0].url})
					setUploadStart(false)
				}
				setLoading(false);
			});
		}
	  };

	let beforeUpload = () => { 
		setImageUrl(false)
		setLoading(true);
	}  
	let remove = () => {
		setFile([]);
		setImageUrl(false);
		setRecord({ ...record, [name]: null });
    };   
	const uploadButton = (
		<div  >
			<Button icon= {loading ? <LoadingOutlined onClick={() => handleChange()}/> : <PlusOutlined />}>Upload</Button>
		</div>
	);

	return <>
		<Upload
        name={name}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
		beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt={name} style={{ width: '100%' }} /> : uploadButton}
      </Upload>
	  {imageUrl ?<div>
		 <div style={{ marginLeft: 10 }}>
					<Button type="danger" icon={<DeleteOutlined />} size="large" onClick={() => remove()} style={{ marginRight: "5px" }}></Button>
					<a href={imageUrl}><Button icon={<EyeOutlined  />} type="primary"></Button></a>
		 </div>
		 </div>: null}
	  {progress > 0 ? <Progress style={{width:'60%'}} percent={progress} /> : null}
	</>
};
