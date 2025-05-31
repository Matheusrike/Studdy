'use client';

import { useState, useEffect } from 'react';
import {
	User,
	Mail,
	Phone,
	MapPin,
	GraduationCap,
	Calendar,
	Edit2,
	Save,
	X,
	Upload,
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [profile, setProfile] = useState({
		name: '',
		email: '',
		phone: '',
		location: '',
		education: '',
		graduationYear: '',
		avatar: '',
		birthDate: '',
		cpf: '',
		role: ''
	});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userId = Cookies.get('userId');

				if (!userId) {
					toast.error('Usuário não autenticado');
					return;
				}

				const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Erro ao buscar dados do usuário');
				}

				const userData = await response.json();
				
				// Formata a data de nascimento para o formato brasileiro
				const birthDate = userData.birth_date ? new Date(userData.birth_date).toLocaleDateString('pt-BR') : '';
				
				setProfile({
					name: userData.name || '',
					email: userData.email || '',
					phone: userData.phone || '',
					location: userData.location || '',
					education: userData.education || '',
					graduationYear: userData.graduationYear || '',
					avatar: userData.avatar || '/default-avatar.png',
					birthDate: birthDate,
					cpf: userData.cpf || '',
					role: userData.role || ''
				});
			} catch (error) {
				console.error('Erro ao buscar dados do usuário:', error);
				toast.error('Erro ao carregar dados do perfil');
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleSave = async () => {
		try {
			const userId = Cookies.get('userId');
			
			// Cria uma cópia do perfil sem a imagem base64
			const profileToSave = {
				...profile,
				avatar: profile.avatar.startsWith('data:image') ? '' : profile.avatar
			};
			
			const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(profileToSave),
			});

			if (!response.ok) {
				throw new Error('Erro ao atualizar perfil');
			}

			toast.success('Perfil atualizado com sucesso!');
			setIsEditing(false);
		} catch (error) {
			console.error('Erro ao atualizar perfil:', error);
			toast.error('Erro ao atualizar perfil');
		}
	};

	const handleImageUpload = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		// Verifica o tipo do arquivo
		if (!file.type.startsWith('image/')) {
			toast.error('Por favor, selecione apenas arquivos de imagem');
			return;
		}

		// Verifica o tamanho do arquivo (máximo 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error('A imagem deve ter no máximo 5MB');
			return;
		}

		try {
			// Converte a imagem para base64
			const reader = new FileReader();
			reader.onload = (e) => {
				const base64Image = e.target.result;
				setProfile(prev => ({ ...prev, avatar: base64Image }));
				toast.success('Foto de perfil atualizada com sucesso!');
			};
			reader.onerror = () => {
				throw new Error('Erro ao ler a imagem');
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Erro ao processar a imagem:', error);
			toast.error('Erro ao atualizar foto de perfil');
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Carregando perfil...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
						Perfil do Usuário
					</h1>
					<Button
						variant={isEditing ? "outline" : "default"}
						onClick={() => setIsEditing(!isEditing)}
						className="gap-2"
					>
						{isEditing ? (
							<>
								<X className="h-4 w-4" />
								Cancelar
							</>
						) : (
							<>
								<Edit2 className="h-4 w-4" />
								Editar Perfil
							</>
						)}
					</Button>
				</div>

				{/* Profile Content */}
				<div className="grid gap-6">
					{/* Avatar and Basic Info */}
					<Card className="overflow-hidden">
						<div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/10">
							<div className="absolute -bottom-16 left-8">
								<div className="relative h-32 w-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg group">
									<Image
										src={profile.avatar || '/default-avatar.png'}
										alt="Profile Avatar"
										fill
										className="object-cover"
									/>
									{isEditing && (
										<label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={handleImageUpload}
											/>
											<Upload className="h-8 w-8 text-white" />
										</label>
									)}
								</div>
							</div>
						</div>
						<CardContent className="pt-20">
							<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
								<div>
									<h2 className="text-2xl font-bold">{profile.name}</h2>
									<p className="text-muted-foreground">
										{profile.role === 'admin' ? 'Administrador' : 
										 profile.role === 'Teacher' ? 'Professor' : 
										 profile.role === 'Student' ? 'Aluno' :
										 profile.role}
									</p>
								</div>
								{isEditing && (
									<Button
										onClick={handleSave}
										className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
									>
										<Save className="h-4 w-4" />
										Salvar Alterações
									</Button>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-xl font-semibold mb-4">Informações Pessoais</h3>
							<div className="grid gap-4">
								<div className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="email"
											value={profile.email}
											onChange={(e) => setProfile({ ...profile, email: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.email}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="date"
											value={profile.birthDate}
											onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">Data de Nascimento: {profile.birthDate}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<User className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="text"
											value={profile.cpf}
											onChange={(e) => setProfile({ ...profile, cpf: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">CPF: {profile.cpf}</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Additional Information */}
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-xl font-semibold mb-4">Informações Adicionais</h3>
							<div className="grid gap-4">
								<div className="flex items-center gap-3">
									<Phone className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="tel"
											value={profile.phone}
											onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.phone || 'Não informado'}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<MapPin className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="text"
											value={profile.location}
											onChange={(e) => setProfile({ ...profile, location: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.location || 'Não informado'}</span>
									)}
								</div>
								<div className="flex items-center gap-3">
									<GraduationCap className="h-5 w-5 text-primary" />
									{isEditing ? (
										<Input
											type="text"
											value={profile.education}
											onChange={(e) => setProfile({ ...profile, education: e.target.value })}
											className="flex-1"
										/>
									) : (
										<span className="text-muted-foreground">{profile.education || 'Não informado'}</span>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
} 