import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ID do proprietário padrão - pode ser alterado aqui ou passado como argumento
const DEFAULT_OWNER_ID = '6dbbaf62-4b77-410c-bd34-77bf0a1547c0';

interface SeedProperty {
	title: string;
	description: string;
	address: string;
	city: string;
	state: string;
	country: string;
	latitude: number;
	longitude: number;
	bedrooms: number;
	bathrooms: number;
	areaSqm: number;
	amenities: string[];
	images: string[];
}

interface SeedListing {
	transactionType: 'rent' | 'sale';
	price: number;
	currency: string;
}

const PROPERTIES_DATA: (SeedProperty & { categoryName: string; listing: SeedListing })[] = [
	// APARTAMENTOS
	{
		categoryName: 'Apartamento',
		title: 'Apartamento T3 no Talatona',
		description: 'Apartamento moderno T3 com 2 suítes, sala ampla, cozinha equipada, varanda com vista para o mar. Localizado em condomínio fechado com segurança 24h.',
		address: 'Rua da Praia, Condomínio Mar Azul, Talatona',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.838333,
		longitude: 13.234444,
		bedrooms: 3,
		bathrooms: 2,
		areaSqm: 120,
		amenities: ['Piscina', 'Estacionamento', 'Segurança 24h', 'Elevador', 'Área de Lazer'],
		images: [
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
		],
		listing: { transactionType: 'rent', price: 250000, currency: 'AOA' },
	},
	{
		categoryName: 'Apartamento',
		title: 'Apartamento T2 no Miramar',
		description: 'Apartamento T2 renovado, bem localizado próximo ao centro comercial. Varanda com vista panorâmica.',
		address: 'Avenida 4 de Fevereiro, Miramar',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.812222,
		longitude: 13.230556,
		bedrooms: 2,
		bathrooms: 1,
		areaSqm: 85,
		amenities: ['Estacionamento', 'Segurança', 'Elevador'],
		images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
		listing: { transactionType: 'rent', price: 180000, currency: 'AOA' },
	},
	{
		categoryName: 'Apartamento',
		title: 'Apartamento T4 de Luxo no Belas',
		description: 'Apartamento de luxo T4 com acabamentos premium, 3 suítes, sala de estar e jantar, cozinha gourmet, área de serviço completa.',
		address: 'Condomínio Belas Business Park, Belas',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.998889,
		longitude: 13.256111,
		bedrooms: 4,
		bathrooms: 3,
		areaSqm: 200,
		amenities: ['Piscina', 'Academia', 'Estacionamento', 'Segurança 24h', 'Elevador', 'Área de Lazer', 'Salão de Festas'],
		images: [
			'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
		],
		listing: { transactionType: 'sale', price: 45000000, currency: 'AOA' },
	},
	{
		categoryName: 'Apartamento',
		title: 'Apartamento T1 no Centro',
		description: 'Apartamento T1 compacto e funcional, ideal para solteiros ou casais. Bem localizado no centro da cidade.',
		address: 'Rua Major Kanhangulo, Centro',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.813611,
		longitude: 13.230833,
		bedrooms: 1,
		bathrooms: 1,
		areaSqm: 45,
		amenities: ['Estacionamento'],
		images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
		listing: { transactionType: 'rent', price: 120000, currency: 'AOA' },
	},

	// CASAS
	{
		categoryName: 'Casa',
		title: 'Casa T4 com Piscina no Benfica',
		description: 'Casa espaçosa T4 com piscina, jardim, garagem para 2 carros. Ideal para famílias grandes.',
		address: 'Rua do Benfica, Benfica',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.916667,
		longitude: 13.183333,
		bedrooms: 4,
		bathrooms: 3,
		areaSqm: 250,
		amenities: ['Piscina', 'Jardim', 'Garagem', 'Segurança 24h', 'Área de Lazer'],
		images: [
			'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
		],
		listing: { transactionType: 'rent', price: 400000, currency: 'AOA' },
	},
	{
		categoryName: 'Casa',
		title: 'Vivenda T5 de Luxo no Alvalade',
		description: 'Vivenda de luxo T5 com acabamentos de primeira, piscina, jardim paisagístico, área de churrasco, garagem para 3 carros.',
		address: 'Rua do Alvalade, Alvalade',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.833333,
		longitude: 13.233333,
		bedrooms: 5,
		bathrooms: 4,
		areaSqm: 400,
		amenities: ['Piscina', 'Jardim', 'Garagem', 'Segurança 24h', 'Área de Churrasco', 'Quinta'],
		images: [
			'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
		],
		listing: { transactionType: 'sale', price: 85000000, currency: 'AOA' },
	},
	{
		categoryName: 'Casa',
		title: 'Casa T3 no Cazenga',
		description: 'Casa T3 bem conservada, com quintal, ideal para família. Localizada em bairro residencial tranquilo.',
		address: 'Rua do Cazenga, Cazenga',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.883333,
		longitude: 13.266667,
		bedrooms: 3,
		bathrooms: 2,
		areaSqm: 150,
		amenities: ['Quintal', 'Garagem'],
		images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
		listing: { transactionType: 'rent', price: 200000, currency: 'AOA' },
	},

	// TERRENOS
	{
		categoryName: 'Terreno',
		title: 'Terreno 500m² no Kilamba',
		description: 'Terreno plano de 500m², pronto para construção. Localizado em área em desenvolvimento, próximo a infraestruturas.',
		address: 'Zona 5, Kilamba Kiaxi',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.933333,
		longitude: 13.283333,
		bedrooms: 0,
		bathrooms: 0,
		areaSqm: 500,
		amenities: [],
		images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
		listing: { transactionType: 'sale', price: 15000000, currency: 'AOA' },
	},
	{
		categoryName: 'Terreno',
		title: 'Terreno 1000m² no Viana',
		description: 'Terreno amplo de 1000m², ideal para construção de vivenda ou empreendimento comercial.',
		address: 'Estrada do Viana, Viana',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.916667,
		longitude: 13.366667,
		bedrooms: 0,
		bathrooms: 0,
		areaSqm: 1000,
		amenities: [],
		images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
		listing: { transactionType: 'sale', price: 25000000, currency: 'AOA' },
	},

	// ESCRITÓRIOS
	{
		categoryName: 'Escritório',
		title: 'Escritório 80m² no Centro Empresarial',
		description: 'Escritório moderno e funcional, pronto para uso. Localizado em prédio comercial no centro da cidade.',
		address: 'Avenida 4 de Fevereiro, Centro Empresarial',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.813611,
		longitude: 13.230833,
		bedrooms: 0,
		bathrooms: 1,
		areaSqm: 80,
		amenities: ['Estacionamento', 'Elevador', 'Segurança', 'Recepção'],
		images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
		listing: { transactionType: 'rent', price: 150000, currency: 'AOA' },
	},
	{
		categoryName: 'Escritório',
		title: 'Escritório 150m² no Belas Business Park',
		description: 'Escritório espaçoso de 150m², com salas de reunião, recepção e área de trabalho aberta.',
		address: 'Belas Business Park, Belas',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.998889,
		longitude: 13.256111,
		bedrooms: 0,
		bathrooms: 2,
		areaSqm: 150,
		amenities: ['Estacionamento', 'Elevador', 'Segurança 24h', 'Recepção', 'Salas de Reunião'],
		images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
		listing: { transactionType: 'rent', price: 300000, currency: 'AOA' },
	},

	// LOJAS/COMÉRCIO
	{
		categoryName: 'Loja',
		title: 'Loja 60m² no Shopping',
		description: 'Loja comercial de 60m², localizada em shopping center com alto fluxo de pessoas.',
		address: 'Shopping Avenida, Avenida 4 de Fevereiro',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.813611,
		longitude: 13.230833,
		bedrooms: 0,
		bathrooms: 1,
		areaSqm: 60,
		amenities: ['Estacionamento', 'Segurança', 'Ar Condicionado'],
		images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
		listing: { transactionType: 'rent', price: 200000, currency: 'AOA' },
	},
	{
		categoryName: 'Loja',
		title: 'Loja 100m² na Rua Comercial',
		description: 'Loja comercial de 100m² em rua de grande movimento, ideal para comércio variado.',
		address: 'Rua Amílcar Cabral, Centro',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.813611,
		longitude: 13.230833,
		bedrooms: 0,
		bathrooms: 1,
		areaSqm: 100,
		amenities: ['Estacionamento'],
		images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
		listing: { transactionType: 'rent', price: 180000, currency: 'AOA' },
	},

	// ARMAZÉNS/GALPÕES
	{
		categoryName: 'Armazém',
		title: 'Armazém 300m² no Viana',
		description: 'Armazém de 300m² com pé direito alto, ideal para armazenamento ou produção. Localizado em zona industrial.',
		address: 'Zona Industrial do Viana, Viana',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.916667,
		longitude: 13.366667,
		bedrooms: 0,
		bathrooms: 1,
		areaSqm: 300,
		amenities: ['Portão de Entrada', 'Estacionamento'],
		images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
		listing: { transactionType: 'rent', price: 250000, currency: 'AOA' },
	},
	{
		categoryName: 'Armazém',
		title: 'Galpão 500m² no Cacuaco',
		description: 'Galpão industrial de 500m², com área de escritório anexa. Ideal para logística ou produção.',
		address: 'Zona Industrial do Cacuaco, Cacuaco',
		city: 'Luanda',
		state: 'Luanda',
		country: 'Angola',
		latitude: -8.783333,
		longitude: 13.316667,
		bedrooms: 0,
		bathrooms: 2,
		areaSqm: 500,
		amenities: ['Portão de Entrada', 'Estacionamento', 'Escritório Anexo'],
		images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
		listing: { transactionType: 'rent', price: 400000, currency: 'AOA' },
	},
];

async function seedLarAngola(ownerId: string) {
	console.log(`🌱 Iniciando seed para ownerId: ${ownerId}`);

	try {
		// Verificar se o owner existe
		const owner = await prisma.larAngolaUser.findUnique({
			where: { id: ownerId },
		});

		if (!owner) {
			throw new Error(`Owner com ID ${ownerId} não encontrado!`);
		}

		console.log(`✅ Owner encontrado: ${owner.fullName}`);

		// Criar ou buscar categorias
		const categoriesMap = new Map<string, string>();

		const categoryNames = [...new Set(PROPERTIES_DATA.map((p) => p.categoryName))];
		console.log(`📁 Criando/buscando ${categoryNames.length} categorias...`);

		for (const categoryName of categoryNames) {
			let category = await prisma.propertyCategoryLA.findFirst({
				where: { name: categoryName },
			});

			if (!category) {
				category = await prisma.propertyCategoryLA.create({
					data: {
						name: categoryName,
						description: `Categoria de imóveis: ${categoryName}`,
					},
				});
				console.log(`  ✅ Categoria criada: ${categoryName}`);
			} else {
				console.log(`  ℹ️  Categoria já existe: ${categoryName}`);
			}

			categoriesMap.set(categoryName, category.id);
		}

		// Criar properties e listings
		console.log(`\n🏠 Criando ${PROPERTIES_DATA.length} imóveis e anúncios...`);

		for (const propertyData of PROPERTIES_DATA) {
			const categoryId = categoriesMap.get(propertyData.categoryName)!;

			// Criar Property
			const property = await prisma.propertyLA.create({
				data: {
					ownerId,
					categoryId,
					title: propertyData.title,
					description: propertyData.description,
					address: propertyData.address,
					city: propertyData.city,
					state: propertyData.state,
					country: propertyData.country,
					latitude: propertyData.latitude,
					longitude: propertyData.longitude,
					bedrooms: propertyData.bedrooms,
					bathrooms: propertyData.bathrooms,
					areaSqm: propertyData.areaSqm,
					amenities: propertyData.amenities,
					images: propertyData.images,
				},
			});

			// Criar Listing
			await prisma.listingLA.create({
				data: {
					propertyId: property.id,
					ownerId,
					transactionType: propertyData.listing.transactionType,
					price: propertyData.listing.price,
					currency: propertyData.listing.currency,
					status: 'active',
				},
			});

			console.log(`  ✅ ${propertyData.title} (${propertyData.listing.transactionType})`);
		}

		console.log(`\n🎉 Seed concluído com sucesso!`);
		console.log(`   - ${categoryNames.length} categorias`);
		console.log(`   - ${PROPERTIES_DATA.length} imóveis criados`);
		console.log(`   - ${PROPERTIES_DATA.length} anúncios criados`);
	} catch (error) {
		console.error('❌ Erro ao executar seed:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// Executar seed
// Se não passar ownerId como argumento, usa o DEFAULT_OWNER_ID
const ownerId = process.argv[2] || DEFAULT_OWNER_ID;

console.log(`📋 Usando ownerId: ${ownerId}`);
if (!process.argv[2]) {
	console.log(`ℹ️  Nenhum ownerId fornecido, usando o padrão: ${DEFAULT_OWNER_ID}`);
	console.log(`💡 Para usar outro ID, execute: npm run seed:lar-angola <seu-owner-id>`);
}

seedLarAngola(ownerId)
	.then(() => {
		console.log('✅ Seed finalizado');
		process.exit(0);
	})
	.catch((error) => {
		console.error('❌ Seed falhou:', error);
		process.exit(1);
	});

